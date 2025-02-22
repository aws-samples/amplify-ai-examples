import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data, conversationHandler, getAlarms, describeAlarm, getMetricDataPoints} from './data/resource';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

const backend = defineBackend({
  getAlarms,
  describeAlarm,
  getMetricDataPoints,
  data,
  auth,
  conversationHandler,
});

backend.conversationHandler.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    resources: [
      'arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0',
      'arn:aws:bedrock:*:*:inference-profile/us.anthropic.claude-3-5-sonnet-20241022-v2:0'
    ],
    actions: [
      'bedrock:InvokeModelWithResponseStream'
    ],
  })
);

backend.getAlarms.resources.lambda.addToRolePolicy(new PolicyStatement({
  actions: ['cloudwatch:DescribeAlarms'],
  resources: [`arn:aws:cloudwatch:*:${process.env.CDK_DEFAULT_ACCOUNT}:*`],
  effect: Effect.ALLOW,
}))

backend.describeAlarm.resources.lambda.addToRolePolicy(new PolicyStatement({
  actions: ['cloudwatch:DescribeAlarms'],
  resources: [`arn:aws:cloudwatch:*:${process.env.CDK_DEFAULT_ACCOUNT}:*`],
  effect: Effect.ALLOW,
}))

backend.getMetricDataPoints.resources.lambda.addToRolePolicy(new PolicyStatement({
  actions: ['cloudwatch:GetMetricData'],
  resources: [`*`],
  effect: Effect.ALLOW,
}))
