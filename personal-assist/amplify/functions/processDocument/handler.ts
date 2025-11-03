import { S3Event, S3Handler } from "aws-lambda";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

const s3Client = new S3Client({});
const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const rdsClient = new RDSDataClient({});

const DB_CLUSTER_ARN = process.env.DB_CLUSTER_ARN!;
const DB_SECRET_ARN = process.env.DB_SECRET_ARN!;
const DB_NAME = process.env.DB_NAME || "vectordb";

// Titan Embeddings v2 model ID
const EMBEDDING_MODEL_ID = "amazon.titan-embed-text-v2:0";

interface EmbeddingResponse {
  embedding: number[];
  inputTextTokenCount: number;
}

/**
 * Generate embeddings using Amazon Titan Embeddings v2
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const input = {
    inputText: text,
    dimensions: 1024, // Titan v2 supports 256, 512, or 1024 dimensions
    normalize: true,
  };

  const command = new InvokeModelCommand({
    modelId: EMBEDDING_MODEL_ID,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(input),
  });

  const response = await bedrockClient.send(command);
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  return responseBody.embedding;
}

/**
 * Chunk text into smaller segments for embedding
 */
function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);

    // Only add non-empty chunks
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Move forward by chunkSize minus overlap
    startIndex += chunkSize - overlap;
  }

  return chunks;
}

/**
 * Store document chunk with embedding in Aurora
 */
async function storeChunkWithEmbedding(
  documentId: string,
  documentName: string,
  chunkIndex: number,
  chunkText: string,
  embedding: number[],
  userId: string
) {
  // Convert embedding array to pgvector format
  const embeddingVector = `[${embedding.join(",")}]`;

  const sql = `
    INSERT INTO document_embeddings
      (document_id, document_name, chunk_index, chunk_text, embedding, user_id, created_at)
    VALUES
      (:document_id, :document_name, :chunk_index, :chunk_text, :embedding::vector, :user_id, NOW())
    ON CONFLICT (document_id, chunk_index)
    DO UPDATE SET
      chunk_text = EXCLUDED.chunk_text,
      embedding = EXCLUDED.embedding,
      updated_at = NOW();
  `;

  const command = new ExecuteStatementCommand({
    resourceArn: DB_CLUSTER_ARN,
    secretArn: DB_SECRET_ARN,
    database: DB_NAME,
    sql,
    parameters: [
      { name: "document_id", value: { stringValue: documentId } },
      { name: "document_name", value: { stringValue: documentName } },
      { name: "chunk_index", value: { longValue: chunkIndex } },
      { name: "chunk_text", value: { stringValue: chunkText } },
      { name: "embedding", value: { stringValue: embeddingVector } },
      { name: "user_id", value: { stringValue: userId } },
    ],
  });

  await rdsClient.send(command);
}

/**
 * Extract text from S3 object
 * Currently supports plain text files
 * TODO: Add PDF, DOCX support with libraries like pdf-parse
 */
async function extractTextFromS3(bucket: string, key: string): Promise<string> {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error("No body in S3 response");
  }

  const bodyContents = await response.Body.transformToString();
  return bodyContents;
}

/**
 * Extract user ID from S3 key
 * Expected format: documents/{userId}/{filename}
 */
function extractUserId(key: string): string {
  const parts = key.split("/");
  if (parts.length >= 2 && parts[0] === "documents") {
    return parts[1];
  }
  return "unknown";
}

/**
 * Main handler for S3 upload events
 */
export const handler: S3Handler = async (event: S3Event) => {
  console.log("Processing document upload event:", JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    console.log(`Processing file: ${key} from bucket: ${bucket}`);

    try {
      // Extract user ID from the S3 key
      const userId = extractUserId(key);

      // Extract text from the document
      const text = await extractTextFromS3(bucket, key);
      console.log(`Extracted ${text.length} characters from document`);

      // Chunk the text
      const chunks = chunkText(text);
      console.log(`Created ${chunks.length} chunks`);

      // Generate document ID from S3 key
      const documentId = key.replace(/\//g, "_");
      const documentName = key.split("/").pop() || key;

      // Process each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}`);

        // Generate embedding
        const embedding = await generateEmbedding(chunk);
        console.log(`Generated embedding with ${embedding.length} dimensions`);

        // Store in database
        await storeChunkWithEmbedding(
          documentId,
          documentName,
          i,
          chunk,
          embedding,
          userId
        );
        console.log(`Stored chunk ${i + 1}/${chunks.length}`);
      }

      console.log(`Successfully processed document: ${documentName}`);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
      throw error;
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Documents processed successfully" }),
  };
};
