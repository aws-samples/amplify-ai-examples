# Personal Assist - Setup Guide

This guide will walk you through setting up the Personal Assist application with pgvector-powered knowledge base.

## Prerequisites

1. **AWS Account** with appropriate permissions for:
   - AWS Amplify
   - Amazon Bedrock (Claude 3.5 Sonnet and Titan Embeddings v2)
   - Amazon RDS (Aurora Serverless v2)
   - Amazon S3
   - AWS Lambda
   - Amazon Cognito
   - VPC and networking resources

2. **Enable Bedrock Models** (if not already enabled):
   - Go to AWS Bedrock console
   - Navigate to Model access
   - Request access to:
     - Claude 3.5 Sonnet
     - Claude 3 Haiku
     - Amazon Titan Embeddings v2

3. **Development Environment**:
   - Node.js 18+ installed
   - npm or yarn package manager
   - AWS CLI configured with appropriate credentials

## Step 1: Install Dependencies

```bash
cd personal-assist
npm install
```

This will install all required dependencies including:
- AWS Amplify packages
- AWS SDK for Bedrock, RDS, and S3
- Next.js and React
- pgvector support

## Step 2: Deploy Backend Infrastructure

Start the Amplify sandbox to deploy all backend resources:

```bash
npx ampx sandbox
```

This command will:
1. Create an Aurora Serverless v2 PostgreSQL cluster with pgvector
2. Set up VPC with public, private, and isolated subnets
3. Deploy Lambda functions for:
   - Document processing (processDocument)
   - Vector search (vectorSearch)
   - Database initialization (initDatabase)
4. Create S3 bucket for document storage
5. Set up GraphQL API with authentication
6. Configure Cognito User Pool for authentication

**Note**: The first deployment may take 15-20 minutes due to Aurora cluster creation.

## Step 3: Initialize the Database

After the sandbox is running, you need to initialize the pgvector extension and create the necessary tables.

### Option 1: Using AWS Lambda Console

1. Open AWS Lambda console
2. Find the `initDatabase` function (will have a generated name with sandbox prefix)
3. Go to the "Test" tab
4. Create a new test event (any empty JSON `{}`)
5. Click "Test" to execute the function

This will:
- Enable the pgvector extension
- Create the `document_embeddings` table with vector column
- Create indexes for efficient vector similarity search
- Set up helper views

### Option 2: Using AWS CLI

```bash
# Get the function name from Amplify outputs
aws lambda invoke \
  --function-name <your-initDatabase-function-name> \
  --payload '{}' \
  response.json

# Check the response
cat response.json
```

### Option 3: Using AWS Console - RDS Query Editor

1. Open AWS RDS console
2. Navigate to your Aurora cluster
3. Use Query Editor v2 to connect
4. Run the following SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create document_embeddings table
CREATE TABLE IF NOT EXISTS document_embeddings (
  id SERIAL PRIMARY KEY,
  document_id VARCHAR(512) NOT NULL,
  document_name VARCHAR(256) NOT NULL,
  chunk_index INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding vector(1024) NOT NULL,
  user_id VARCHAR(256) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  UNIQUE(document_id, chunk_index)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx
ON document_embeddings
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS document_embeddings_user_id_idx
ON document_embeddings(user_id);

CREATE INDEX IF NOT EXISTS document_embeddings_document_id_idx
ON document_embeddings(document_id);

-- Create helper view
CREATE OR REPLACE VIEW document_stats AS
SELECT
  user_id,
  document_id,
  document_name,
  COUNT(*) as chunk_count,
  MIN(created_at) as created_at,
  MAX(updated_at) as last_updated
FROM document_embeddings
GROUP BY user_id, document_id, document_name;
```

## Step 4: Start the Frontend

In a new terminal window (keep the sandbox running):

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Step 5: Test the Application

### 1. Sign Up / Login
- Navigate to http://localhost:3000
- Create a new account using email/password
- Verify your email (check your inbox)

### 2. Upload Documents
- Click "Upload Documents" in the sidebar
- Drag and drop or select text files (.txt, .md)
- Wait for processing to complete (status will change to "Ready")

### 3. Ask Questions
- Go back to the chat (click "Back to Chat")
- Start a new conversation
- Ask questions about your uploaded documents
- The AI will automatically search your knowledge base and provide answers

### Example Queries
```
"What are the main topics in my documents?"
"Summarize the key points from [document name]"
"Find information about [specific topic]"
```

## Architecture Overview

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                      │
│  - Chat Interface                                            │
│  - Document Upload                                           │
│  - Conversation History                                      │
└───────────────┬─────────────────────────────────────────────┘
                │ GraphQL API
┌───────────────▼─────────────────────────────────────────────┐
│              AWS Amplify Backend (GraphQL API)               │
│  - Authentication (Cognito)                                  │
│  - Data API (AppSync)                                        │
│  - Storage (S3)                                              │
└───────┬────────────────────────────┬─────────────────────────┘
        │                            │
        │ S3 Event Trigger          │ Lambda Invoke
        │                            │
┌───────▼────────────┐      ┌───────▼─────────────┐
│  processDocument   │      │   vectorSearch       │
│  Lambda            │      │   Lambda             │
│  - Chunk text      │      │  - Generate query    │
│  - Generate        │      │    embedding         │
│    embeddings      │      │  - Similarity search │
│  - Store vectors   │      │  - Return results    │
└───────┬────────────┘      └───────┬──────────────┘
        │                            │
        │ Write                      │ Read
        │                            │
┌───────▼────────────────────────────▼──────────────┐
│     Aurora Serverless v2 PostgreSQL               │
│     with pgvector Extension                       │
│  - document_embeddings table                      │
│  - HNSW index for fast similarity search          │
└───────────────────────────────────────────────────┘
```

### Data Flow

1. **Document Upload**:
   - User uploads file → S3 bucket (`documents/` prefix)
   - S3 triggers `processDocument` Lambda
   - Lambda chunks document, generates embeddings (Titan v2)
   - Stores chunks + vectors in Aurora with pgvector

2. **Knowledge Base Query**:
   - User asks question in chat
   - Claude conversation uses `searchKnowledgeBase` tool
   - `vectorSearch` Lambda generates query embedding
   - pgvector performs cosine similarity search
   - Returns top-k relevant chunks to Claude
   - Claude generates answer using retrieved context

## Configuration

### Environment Variables

The following environment variables are automatically configured by Amplify:

- `DB_CLUSTER_ARN`: Aurora cluster ARN
- `DB_SECRET_ARN`: Database credentials secret ARN
- `DB_NAME`: Database name (default: `vectordb`)

### Customization

#### Adjust Embedding Dimensions

In `amplify/functions/processDocument/handler.ts` and `amplify/functions/vectorSearch/handler.ts`:

```typescript
const input = {
  inputText: text,
  dimensions: 1024, // Change to 256, 512, or 1024
  normalize: true,
};
```

**Important**: If you change dimensions, update the database table:

```sql
-- Drop existing table
DROP TABLE document_embeddings;

-- Recreate with new dimension
CREATE TABLE document_embeddings (
  -- ... other columns ...
  embedding vector(512) NOT NULL, -- Change dimension here
  -- ... other columns ...
);
```

#### Adjust Chunk Size

In `amplify/functions/processDocument/handler.ts`:

```typescript
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200)
```

Change `chunkSize` and `overlap` values as needed.

#### Adjust Search Parameters

In chat queries, the AI can pass:
- `limit`: Number of results (default: 5)
- `threshold`: Similarity threshold 0-1 (default: 0.7)

## Monitoring and Debugging

### View Logs

```bash
# Lambda logs
aws logs tail /aws/lambda/<function-name> --follow

# Or use CloudWatch Logs console
```

### Check Database

```bash
# Connect to Aurora using RDS Query Editor
# Or use psql if you have database access configured
```

### Verify Documents

Check S3 bucket for uploaded documents:
```bash
aws s3 ls s3://<your-bucket-name>/documents/
```

## Troubleshooting

### Issue: Database initialization fails

**Solution**: Check IAM permissions for the Lambda function. Ensure it has:
- `rds-data:ExecuteStatement`
- `secretsmanager:GetSecretValue`

### Issue: Document processing is slow

**Solution**:
- Increase Lambda memory (edit `amplify/functions/processDocument/resource.ts`)
- Reduce chunk size or overlap
- Consider parallel processing for large documents

### Issue: Vector search returns no results

**Solution**:
- Check that documents have been processed (query `document_embeddings` table)
- Lower the similarity threshold
- Verify embeddings are being generated correctly (check Lambda logs)

### Issue: "Cannot find module 'pgvector'"

**Solution**: The `pgvector` npm package is included in root `package.json` but is only used for type definitions. The actual pgvector functionality is provided by the PostgreSQL extension.

## Cost Considerations

### Estimated Monthly Costs (Light Usage)

- **Aurora Serverless v2**: $43-86/month (0.5-2 ACUs)
- **Lambda**: $0-5/month (generous free tier)
- **S3**: $0-1/month (first 50GB free)
- **Bedrock**:
  - Titan Embeddings v2: ~$0.0001 per 1K tokens
  - Claude 3.5 Sonnet: ~$3 per 1M input tokens
- **Data Transfer**: $0-5/month

**Total**: ~$50-100/month for moderate usage

### Cost Optimization Tips

1. **Aurora**: Set `serverlessV2MinCapacity` to 0.5 (minimum)
2. **Lambda**: Use appropriate memory settings
3. **S3**: Enable S3 Intelligent-Tiering for older documents
4. **Bedrock**: Cache frequently accessed embeddings

## Security Best Practices

1. **Authentication**: Use strong passwords and enable MFA
2. **Data Isolation**: Users can only access their own documents
3. **Secrets**: Never commit AWS credentials or secrets
4. **VPC**: Database is in isolated subnet (not publicly accessible)
5. **IAM**: Follow principle of least privilege

## Next Steps

- Add PDF and DOCX support (install pdf-parse, mammoth packages)
- Implement document deletion and re-indexing
- Add document search and management UI
- Set up monitoring and alerting
- Configure custom domain with Amplify Hosting
- Enable CloudWatch insights for Lambda functions

## Support

For issues and questions:
- GitHub Issues: https://github.com/aws-samples/amplify-ai-examples/issues
- AWS Amplify Docs: https://docs.amplify.aws/
- AWS Bedrock Docs: https://docs.aws.amazon.com/bedrock/
