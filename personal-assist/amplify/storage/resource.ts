import { defineStorage } from "@aws-amplify/backend";

export const documentStorage = defineStorage({
  name: "documentStorage",
  access: (allow) => ({
    "documents/*": [
      allow.authenticated.to(["read", "write", "delete"]),
    ],
    "processed/*": [
      allow.authenticated.to(["read"]),
    ],
  }),
  triggers: {
    onUpload: {
      handler: "../functions/processDocument/handler",
    },
  },
});
