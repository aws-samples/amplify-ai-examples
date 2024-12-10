import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "pictureDrive",
  isDefault: true,
  access: (allow) => ({
    "pictures/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});

export const knowledgeBaseBucket = defineStorage({
  name: "knowledgeBaseBucket",
  access: (allow) => ({
    "textfiles/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
});
