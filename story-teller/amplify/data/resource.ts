import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { generateImage } from "../functions/generateImage/resource";
import { getNews } from "../functions/getNews/resource";

const schema = a.schema({
  Story: a
    .model({
      title: a.string().required(),
      story: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()]),
  chat: a
    .conversation({
      aiModel: a.ai.model("Claude 3 Sonnet"),
      systemPrompt:
        "You are a story telling finder. You will assist " +
        "the user in finding a story that matches the story string, " +
        "title string or id.",

      tools: [
        a.ai.dataTool({
          name: "listStories",
          description:
            "This lists all stories from the Story model. " +
            "Use it to find stories with the story field " +
            "and display them to user.",
          model: a.ref("Story"),
          modelOperation: "list",
        }),
        a.ai.dataTool({
          name: "getNews",
          description:
            "Help generate a story prompt using " +
            "the current news.  User will provide a category",
          query: a.ref("getNews"),
        }),
        a.ai.dataTool({
          name: "knowledgeBase",
          description:
            "Used to search a knowledge base of style " +
            "dictionary documentation. Use it to help create story prompts",
          query: a.ref("knowledgeBase"),
        }),
      ],
    })
    .authorization((allow) => allow.owner()),
  summarizer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Sonnet"),
      systemPrompt:
        "You are a helpful assistant that summarizes stories. " +
        "Give a concise summary of the supplied story. " +
        "The summary should be one or two sentences long",
      inferenceConfiguration: {
        temperature: 0.7,
        topP: 1,
        maxTokens: 400,
      },
    })
    .arguments({
      story: a.string(),
    })
    .returns(
      a.customType({
        summary: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
  generateStory: a
    .generation({
      aiModel: a.ai.model("Claude 3 Sonnet"),
      systemPrompt:
        "Generate a story and a title that's fun and exciting, " +
        "leave it off in a cliff hanger. The story should be a " +
        "fun magical story. The title should be interesting and " +
        "short.",
    })
    .arguments({
      description: a.string(),
    })
    .returns(
      a.customType({
        story: a.string().required(),
        title: a.string().required(),
      })
    )
    .authorization((allow) => allow.authenticated()),
  generateImage: a
    .query()
    .arguments({
      prompt: a.string(),
    })
    .returns(a.string().array())
    .handler(a.handler.function(generateImage))
    .authorization((allow) => [allow.authenticated()]),
  getNews: a
    .query()
    .arguments({
      category: a.string(),
    })
    .returns(
      a.customType({
        title: a.string(),
        description: a.string(),
      })
    )
    .authorization((allow) => allow.authenticated())
    .handler(a.handler.function(getNews)),
  knowledgeBase: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "KnowledgeBaseDataSource",
        entry: "./kbResolver.js",
      })
    )
    .returns(a.string())
    .authorization((allow) => [allow.authenticated()]),
});
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
