import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export const client = generateClient<Schema>({ authMode: "userPool" });
export const { useAIGeneration, useAIConversation } = createAIHooks(client);

export type Conversation = Schema["chat"]["type"];
