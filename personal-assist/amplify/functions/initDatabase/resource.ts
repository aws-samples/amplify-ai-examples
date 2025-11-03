import { defineFunction } from "@aws-amplify/backend";

export const initDatabase = defineFunction({
  name: "initDatabase",
  entry: "./handler.ts",
  timeoutSeconds: 60,
  memoryMB: 256,
  environment: {
    // Will be populated by backend.ts with database connection info
  },
});
