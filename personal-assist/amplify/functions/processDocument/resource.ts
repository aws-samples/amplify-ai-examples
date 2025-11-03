import { defineFunction } from "@aws-amplify/backend";

export const processDocument = defineFunction({
  name: "processDocument",
  entry: "./handler.ts",
  timeoutSeconds: 300, // 5 minutes for processing large documents
  memoryMB: 1024,
  environment: {
    // Will be populated by backend.ts with database connection info
  },
});
