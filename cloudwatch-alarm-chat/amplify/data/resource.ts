import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';
import { defineConversationHandlerFunction } from '@aws-amplify/backend-ai/conversation';

const crossRegionModel = "us.anthropic.claude-3-5-sonnet-20241022-v2:0";

export const conversationHandler = defineConversationHandlerFunction({
  entry: "./conversationHandler.ts",
  name: "conversationHandler",
  models: [{ modelId: crossRegionModel }],
});

export const getAlarms = defineFunction({
  name: 'getAlarms',
  entry: './getAlarms.ts',
});

export const describeAlarm = defineFunction({
  name: 'describeAlarm',
  entry: './describeAlarm.ts',
});

export const getMetricDataPoints = defineFunction({
  name: 'getMetricDataPoints',
  entry: './getMetricDataPoints.ts',
})

const schema = a.schema({
  AlarmDetails: a.customType({
    name: a.string(),
    description: a.string(),
    state: a.string(),
    threshold: a.float(),
    lastUpdate: a.datetime(),
    actions: a.string(),
    namespace: a.string(),
    dimensions: a.json().array(),
    deepLink: a.url(),
  }),
  DataPoint: a.customType({
    timestamp: a.datetime(),
    value: a.float(),
  }),
  MetricDataPoints: a.customType({
    label: a.string(),
    dataPoints: a.ref("DataPoint").array(),
  }),

  getAlarms: a.query()
    .arguments({
      prefix: a.string(),
      region: a.string().required(),
    })
    .returns(a.customType({
      statusCode: a.integer().required(),
      body: a.json().required(),
    }))
    .handler(a.handler.function(getAlarms))
    .authorization((allow) => allow.authenticated()),

  describeAlarm: a.query()
    .arguments({
      alarmName: a.string().required(),
    })
    .returns(
      a.customType({
        statusCode: a.integer().required(),
        error: a.string(),
        details: a.ref("AlarmDetails"),
      })
    )
    .handler(a.handler.function(describeAlarm))
    .authorization((allow) => allow.authenticated()),

  getMetricDataPoints: a.query()
    .arguments({
      namespace: a.string().required(),
      metricName: a.string().required(),
      dimensionName: a.string().required(),
      dimensionValue: a.string().required(),
    })
    .returns(
      a.customType({
        statusCode: a.integer().required(),
        error: a.string(),
        datapoints: a.ref("MetricDataPoints"),
      })
    )
    .handler(a.handler.function(getMetricDataPoints))
    .authorization((allow) => allow.authenticated()),

  chat: a.conversation({
    aiModel: {
      resourcePath: crossRegionModel,
    },
    handler: conversationHandler,
    systemPrompt: `You are a helpful assistant. Answer in markdown if you think is useful. 
You can use tools, but there's no need to tell that to the user. 
When you're asked to show datapoints show them even if they are 0, don't worry that the datapoint value is 0.`,
    tools: [
      a.ai.dataTool({
        name: "getAlarms",
        description: "Get the list of CloudWatch alarms by region given an optional prefix",
        query: a.ref("getAlarms"),
      }),
      a.ai.dataTool({
        name: "describeAlarm",
        description: "Describe a CloudWatch alarm by name to get its details",
        query: a.ref("describeAlarm"),
      }),
      a.ai.dataTool({
        name: "getMetricDataPoints",
        description: "Get the metric data points for a given metric for the last hour with 5 minutes period, you can use the result to plot the metric.",
        query: a.ref("getMetricDataPoints"),
      }),
    ]
  }).authorization((allow) => allow.owner()),

  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt: `You are a helpful assistant that writes descriptive names for conversations. Conversations are about Amazon CloudWatch alarms. Names should be 2-10 words long. Use descriptive names and avoid puns.`,
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

  generateFollowup: a
    .generation({
      aiModel: a.ai.model("Claude 3 Haiku"),
      systemPrompt: `You are a helpful assistant that generates followup questions for a given conversation about Amazon CloudWatch alarms. 
Generate question that are strictly related to the conversation. Generate up to 4 followup. Questions should be 2-10 words long. 
It's important that you use the same language as the conversation.
Questions must be in the form of an user question and it must be possible to use them as user message as is. 
For example if you think that's relevant to the user to see the details for a given alarm, then the question must be: Show me the details for alarm <alarmID>.`
    })
    .arguments({
      content: a.string(),
    })
    .returns(
      a.customType({
        question: a.string().array(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});