import type { Handler } from "aws-lambda";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

const bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
const rdsClient = new RDSDataClient({});

const DB_CLUSTER_ARN = process.env.DB_CLUSTER_ARN!;
const DB_SECRET_ARN = process.env.DB_SECRET_ARN!;
const DB_NAME = process.env.DB_NAME || "vectordb";

// Titan Embeddings v2 model ID
const EMBEDDING_MODEL_ID = "amazon.titan-embed-text-v2:0";

interface SearchResult {
  documentName: string;
  chunkText: string;
  similarity: number;
  chunkIndex: number;
}

/**
 * Generate embeddings using Amazon Titan Embeddings v2
 */
async function generateEmbedding(text: string): Promise<number[]> {
  const input = {
    inputText: text,
    dimensions: 1024, // Must match the dimension used in processDocument
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
 * Search for similar documents using pgvector cosine similarity
 */
async function searchSimilarChunks(
  queryEmbedding: number[],
  userId: string,
  limit: number = 5,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  const embeddingVector = `[${queryEmbedding.join(",")}]`;

  // Using cosine similarity operator (<=>)
  // Lower distance means higher similarity
  const sql = `
    SELECT
      document_name,
      chunk_text,
      chunk_index,
      1 - (embedding <=> :query_embedding::vector) as similarity
    FROM document_embeddings
    WHERE user_id = :user_id
      AND 1 - (embedding <=> :query_embedding::vector) > :threshold
    ORDER BY embedding <=> :query_embedding::vector
    LIMIT :limit;
  `;

  const command = new ExecuteStatementCommand({
    resourceArn: DB_CLUSTER_ARN,
    secretArn: DB_SECRET_ARN,
    database: DB_NAME,
    sql,
    parameters: [
      { name: "query_embedding", value: { stringValue: embeddingVector } },
      { name: "user_id", value: { stringValue: userId } },
      { name: "threshold", value: { doubleValue: threshold } },
      { name: "limit", value: { longValue: limit } },
    ],
  });

  const response = await rdsClient.send(command);

  if (!response.records) {
    return [];
  }

  return response.records.map((record) => ({
    documentName: record[0].stringValue || "",
    chunkText: record[1].stringValue || "",
    chunkIndex: Number(record[2].longValue || 0),
    similarity: Number(record[3].doubleValue || 0),
  }));
}

/**
 * Handler for vector search requests from GraphQL
 * This is called from Amplify Data as a Lambda resolver
 */
export const handler: Handler = async (event: any) => {
  console.log("Vector search request:", JSON.stringify(event, null, 2));

  try {
    // Extract arguments and identity from GraphQL context
    const { query, limit = 5, threshold = 0.7 } = event.arguments || {};
    const userId = event.identity?.sub || event.identity?.username;

    if (!query) {
      throw new Error("Missing required parameter: query");
    }

    if (!userId) {
      throw new Error("User identity not found in request context");
    }

    console.log(`Searching for: "${query}" (user: ${userId})`);

    // Generate embedding for the query
    console.log("Generating embedding for query...");
    const queryEmbedding = await generateEmbedding(query);
    console.log(`Generated query embedding with ${queryEmbedding.length} dimensions`);

    // Search for similar chunks
    console.log(`Searching (limit: ${limit}, threshold: ${threshold})`);
    const results = await searchSimilarChunks(
      queryEmbedding,
      userId,
      limit,
      threshold
    );

    console.log(`Found ${results.length} similar chunks`);

    // Format results for the AI conversation
    // Return as JSON string for the AI to parse
    if (results.length === 0) {
      return JSON.stringify({
        message: "No relevant documents found in knowledge base",
        results: [],
      });
    }

    const formattedResults = results.map((result, index) => ({
      rank: index + 1,
      source: result.documentName,
      similarity: Math.round(result.similarity * 100) + "%",
      content: result.chunkText,
    }));

    return JSON.stringify({
      message: `Found ${results.length} relevant document(s)`,
      results: formattedResults,
    });
  } catch (error) {
    console.error("Error in vector search:", error);

    // Return error as JSON string so AI can handle it gracefully
    return JSON.stringify({
      error: "Error searching knowledge base",
      message: error instanceof Error ? error.message : String(error),
      results: [],
    });
  }
};
