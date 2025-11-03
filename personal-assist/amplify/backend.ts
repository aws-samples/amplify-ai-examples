import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { documentStorage } from "./storage/resource";
import { processDocument } from "./functions/processDocument/resource";
import { vectorSearch } from "./functions/vectorSearch/resource";
import { initDatabase } from "./functions/initDatabase/resource";
import { createVectorDatabase } from "./database/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  documentStorage,
  processDocument,
  vectorSearch,
  initDatabase,
});

// Create the Aurora Serverless v2 cluster with pgvector
const { cluster, secret, vpc, securityGroup } = createVectorDatabase({
  construct: backend.stack,
});

// Environment variables for database connection
const dbEnv = {
  DB_CLUSTER_ARN: cluster.clusterArn,
  DB_SECRET_ARN: secret.secretArn,
  DB_NAME: "vectordb",
};

// Configure processDocument function
backend.processDocument.resources.lambda.addEnvironment(
  "DB_CLUSTER_ARN",
  dbEnv.DB_CLUSTER_ARN
);
backend.processDocument.resources.lambda.addEnvironment(
  "DB_SECRET_ARN",
  dbEnv.DB_SECRET_ARN
);
backend.processDocument.resources.lambda.addEnvironment(
  "DB_NAME",
  dbEnv.DB_NAME
);

// Configure vectorSearch function
backend.vectorSearch.resources.lambda.addEnvironment(
  "DB_CLUSTER_ARN",
  dbEnv.DB_CLUSTER_ARN
);
backend.vectorSearch.resources.lambda.addEnvironment(
  "DB_SECRET_ARN",
  dbEnv.DB_SECRET_ARN
);
backend.vectorSearch.resources.lambda.addEnvironment(
  "DB_NAME",
  dbEnv.DB_NAME
);

// Configure initDatabase function
backend.initDatabase.resources.lambda.addEnvironment(
  "DB_CLUSTER_ARN",
  dbEnv.DB_CLUSTER_ARN
);
backend.initDatabase.resources.lambda.addEnvironment(
  "DB_SECRET_ARN",
  dbEnv.DB_SECRET_ARN
);
backend.initDatabase.resources.lambda.addEnvironment(
  "DB_NAME",
  dbEnv.DB_NAME
);

// Grant RDS Data API permissions to Lambda functions
const rdsDataApiPolicy = new PolicyStatement({
  actions: [
    "rds-data:ExecuteStatement",
    "rds-data:BatchExecuteStatement",
    "rds-data:BeginTransaction",
    "rds-data:CommitTransaction",
    "rds-data:RollbackTransaction",
  ],
  resources: [cluster.clusterArn],
});

backend.processDocument.resources.lambda.addToRolePolicy(rdsDataApiPolicy);
backend.vectorSearch.resources.lambda.addToRolePolicy(rdsDataApiPolicy);
backend.initDatabase.resources.lambda.addToRolePolicy(rdsDataApiPolicy);

// Grant Secrets Manager permissions
const secretsPolicy = new PolicyStatement({
  actions: ["secretsmanager:GetSecretValue"],
  resources: [secret.secretArn],
});

backend.processDocument.resources.lambda.addToRolePolicy(secretsPolicy);
backend.vectorSearch.resources.lambda.addToRolePolicy(secretsPolicy);
backend.initDatabase.resources.lambda.addToRolePolicy(secretsPolicy);

// Grant Bedrock permissions for embeddings
const bedrockPolicy = new PolicyStatement({
  actions: ["bedrock:InvokeModel"],
  resources: [
    `arn:aws:bedrock:us-east-1::foundation-model/amazon.titan-embed-text-v2:0`,
  ],
});

backend.processDocument.resources.lambda.addToRolePolicy(bedrockPolicy);
backend.vectorSearch.resources.lambda.addToRolePolicy(bedrockPolicy);

// Connect Lambda functions to VPC for database access
backend.processDocument.resources.lambda.connections.allowToDefaultPort(cluster);
backend.vectorSearch.resources.lambda.connections.allowToDefaultPort(cluster);
backend.initDatabase.resources.lambda.connections.allowToDefaultPort(cluster);

// Grant storage bucket access to processDocument
backend.documentStorage.resources.bucket.grantRead(
  backend.processDocument.resources.lambda
);

// Add vectorSearch function to GraphQL API as a data source
const vectorSearchDataSource = backend.data.addLambdaDataSource(
  "vectorSearchDataSource",
  backend.vectorSearch.resources.lambda
);

// Output important values
backend.addOutput({
  custom: {
    databaseClusterArn: cluster.clusterArn,
    databaseSecretArn: secret.secretArn,
    databaseName: dbEnv.DB_NAME,
  },
});
