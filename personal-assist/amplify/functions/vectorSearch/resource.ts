import { defineFunction } from "@aws-amplify/backend";

export const vectorSearch = defineFunction({
  name: "vectorSearch",
  entry: "./handler.ts",
  timeoutSeconds: 30,
  memoryMB: 512,
  environment: {
    // Will be populated by backend.ts with database connection info
  },
});
