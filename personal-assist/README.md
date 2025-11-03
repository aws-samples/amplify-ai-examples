# Personal Assist - AI Chat with pgvector Knowledge Base

A Next.js application that combines conversational AI with a powerful knowledge base powered by Aurora Serverless v2 with pgvector. Upload documents, ask questions, and get intelligent answers based on your personal knowledge base.

## Features

- **Conversational AI**: ChatGPT/Claude.ai-like interface with conversation history
- **Knowledge Base**: Upload and search documents using pgvector for semantic search
- **Amazon Titan Embeddings v2**: State-of-the-art embeddings for accurate retrieval
- **Aurora Serverless v2**: Scalable PostgreSQL database with pgvector extension
- **Document Processing**: Automatic chunking and embedding generation
- **RAG (Retrieval-Augmented Generation)**: AI answers questions using your documents

## Architecture

- **Frontend**: Next.js App Router with Amplify UI components
- **Backend**: Amplify Gen2 with AWS CDK
- **Database**: Aurora Serverless v2 PostgreSQL with pgvector extension
- **AI Model**: Claude 3.5 Sonnet from Amazon Bedrock
- **Embeddings**: Amazon Titan Embeddings v2
- **Storage**: S3 for document storage
- **API**: GraphQL via AWS Amplify Data

## Getting Started

### Prerequisites

- Node.js 18+ installed
- AWS account with:
  - Amplify access
  - Bedrock access (Claude 3.5 Sonnet and Titan Embeddings v2 enabled)
  - Permissions to create Aurora Serverless v2 clusters

### Installation

1. Clone the repository and `cd` into the `personal-assist` directory
   ```bash
   cd personal-assist
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the Amplify sandbox backend
   ```bash
   npx ampx sandbox
   ```
   This will deploy:
   - Aurora Serverless v2 PostgreSQL cluster with pgvector
   - S3 bucket for document storage
   - Lambda functions for document processing and vector search
   - GraphQL API with authentication

4. Start the Next.js development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Upload Documents**: Use the document upload feature to add PDFs, text files, or other documents
3. **Chat**: Ask questions and the AI will search your knowledge base for relevant information
4. **Manage Conversations**: View and resume past conversations from the sidebar

## How It Works

1. **Document Upload**: Documents are uploaded to S3
2. **Processing**: A Lambda function chunks the document and generates embeddings using Titan Embeddings v2
3. **Storage**: Embeddings are stored in Aurora PostgreSQL with pgvector
4. **Query**: When you ask a question, it's converted to an embedding
5. **Search**: pgvector performs similarity search to find relevant chunks
6. **Generation**: Claude uses the relevant chunks to generate accurate answers

## Tech Stack

- **Next.js 14** - React framework
- **AWS Amplify Gen2** - Backend infrastructure
- **Aurora Serverless v2** - Scalable PostgreSQL database
- **pgvector** - Vector similarity search
- **Amazon Bedrock** - AI models (Claude 3.5 Sonnet, Titan Embeddings v2)
- **AWS Lambda** - Serverless functions
- **Amazon S3** - Document storage
- **Amazon Cognito** - Authentication

## License

This example is made available under the MIT-0 license. See the LICENSE file.
