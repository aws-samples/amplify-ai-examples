import type { Handler } from "aws-lambda";
import { RDSDataClient, ExecuteStatementCommand } from "@aws-sdk/client-rds-data";

const rdsClient = new RDSDataClient({});

const DB_CLUSTER_ARN = process.env.DB_CLUSTER_ARN!;
const DB_SECRET_ARN = process.env.DB_SECRET_ARN!;
const DB_NAME = process.env.DB_NAME || "vectordb";

/**
 * Execute a SQL statement
 */
async function executeSql(sql: string) {
  const command = new ExecuteStatementCommand({
    resourceArn: DB_CLUSTER_ARN,
    secretArn: DB_SECRET_ARN,
    database: DB_NAME,
    sql,
  });

  return await rdsClient.send(command);
}

/**
 * Initialize the database with pgvector extension and tables
 */
export const handler: Handler = async (event) => {
  console.log("Initializing database...", JSON.stringify(event, null, 2));

  try {
    // Enable pgvector extension
    console.log("Enabling pgvector extension...");
    await executeSql("CREATE EXTENSION IF NOT EXISTS vector;");
    console.log("pgvector extension enabled");

    // Create document_embeddings table
    console.log("Creating document_embeddings table...");
    await executeSql(`
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
    `);
    console.log("document_embeddings table created");

    // Create indexes for better query performance
    console.log("Creating indexes...");

    // Index for vector similarity search (HNSW for approximate nearest neighbor)
    await executeSql(`
      CREATE INDEX IF NOT EXISTS document_embeddings_embedding_idx
      ON document_embeddings
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64);
    `);

    // Index for user-based filtering
    await executeSql(`
      CREATE INDEX IF NOT EXISTS document_embeddings_user_id_idx
      ON document_embeddings(user_id);
    `);

    // Index for document lookups
    await executeSql(`
      CREATE INDEX IF NOT EXISTS document_embeddings_document_id_idx
      ON document_embeddings(document_id);
    `);

    console.log("Indexes created");

    // Create a view for document statistics (optional but useful)
    console.log("Creating views...");
    await executeSql(`
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
    `);
    console.log("Views created");

    console.log("Database initialization completed successfully");

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Database initialized successfully",
        details: {
          extension: "pgvector enabled",
          tables: ["document_embeddings"],
          indexes: [
            "document_embeddings_embedding_idx (HNSW)",
            "document_embeddings_user_id_idx",
            "document_embeddings_document_id_idx",
          ],
          views: ["document_stats"],
        },
      }),
    };
  } catch (error) {
    console.error("Error initializing database:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to initialize database",
        message: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
