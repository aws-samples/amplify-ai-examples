import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Knowledge base search query - uses Lambda resolver for vector search
  searchKnowledgeBase: a
    .query()
    .arguments({
      query: a.string().required(),
      limit: a.integer(),
      threshold: a.float(),
    })
    .returns(a.string())
    .handler(a.handler.function("vectorSearch"))
    .authorization((allow) => [allow.authenticated()]),

  // Main chat conversation with knowledge base integration
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `You are a helpful AI assistant with access to the user's personal knowledge base.

When answering questions:
1. First, search the knowledge base using the searchKnowledgeBase tool to find relevant information
2. Use the retrieved information to provide accurate, well-informed answers
3. Always cite which documents you're referencing in your answers
4. If no relevant information is found in the knowledge base, let the user know and provide general assistance
5. Be conversational and helpful

Remember to use the searchKnowledgeBase tool whenever the user asks questions that might be answered by their uploaded documents.`,
      tools: [
        {
          query: a.ref("searchKnowledgeBase"),
          name: "searchKnowledgeBase",
          description:
            "Search the user's personal knowledge base for relevant information. Use this tool when the user asks questions that might be answered by their uploaded documents. Pass the user's question or relevant search terms as the query parameter.",
        },
      ],
    })
    .authorization((allow) => allow.owner()),

  // Conversation naming utility
  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt: `You are a helpful assistant that writes descriptive names for conversations. Names should be 2-10 words long`,
    })
    .arguments({
      content: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),

  // Document metadata model (optional - for tracking uploads)
  Document: a
    .model({
      name: a.string().required(),
      key: a.string().required(),
      size: a.integer(),
      contentType: a.string(),
      uploadedAt: a.datetime(),
      status: a.enum(["processing", "completed", "failed"]),
      chunkCount: a.integer(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
