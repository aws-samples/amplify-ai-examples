import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnApp, CfnCampaign, CfnSegment } from "aws-cdk-lib/aws-pinpoint";
import { Stack } from "aws-cdk-lib";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// extract L1 CfnUserPool resources
const { cfnUserPool } = backend.auth.resources.cfnResources;
// modify cfnUserPool policies directly
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 10,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    requireUppercase: true,
  },
};

const inAppMessagingStack = backend.createStack("inAppMessaging-stack");

// create a Pinpoint app
const pinpoint = new CfnApp(inAppMessagingStack, "Pinpoint", {
  name: "TravelPlanner",
});

// create a segment
const mySegment = new CfnSegment(inAppMessagingStack, "Segment", {
  applicationId: pinpoint.ref,
  name: "TripSegment",
});

// create a campaign with event and in-app message template
new CfnCampaign(inAppMessagingStack, "Campaign", {
  applicationId: pinpoint.ref,
  name: "TripCampaign",
  segmentId: mySegment.attrSegmentId,
  schedule: {
    // ensure the start and end time are in the future
    startTime: "2025-02-23T14:39:34Z",
    endTime: "2025-02-28T14:32:40Z",
    frequency: "IN_APP_EVENT",
    eventFilter: {
      dimensions: {
        eventType: {
          dimensionType: "INCLUSIVE",
          values: ["trip_event"],
        },
      },
      filterType: "ENDPOINT",
    },
  },

  messageConfiguration: {
    inAppMessage: {
      layout: "MOBILE_FEED",
      content: [
        {
          // define the content of the in-app message
          bodyConfig: {
            alignment: "CENTER",
            body: "Someone created a new trip, it might be interesting for you!",
            textColor: "#FFFFFF",
          },
          backgroundColor: "#E94C3D",
          headerConfig: {
            alignment: "CENTER",
            header: "New Trip Added!",
            textColor: "#FFFFFF",
          },
          // optionally, define buttons, images, etc.
        },
      ],
    },
  },
});

//create an IAM policy to allow interacting with Pinpoint in-app messaging
const pinpointPolicy = new Policy(inAppMessagingStack, "PinpointPolicy", {
  policyName: "PinpointPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "mobiletargeting:GetInAppMessages",
        "mobiletargeting:UpdateEndpoint",
        "mobiletargeting:PutEvents",
      ],
      resources: [pinpoint.attrArn + "/*", pinpoint.attrArn],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(
  pinpointPolicy
);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(
  pinpointPolicy
);

// patch the custom Pinpoint resource to the expected output configuration
backend.addOutput({
  notifications: {
    amazon_pinpoint_app_id: pinpoint.ref,
    aws_region: Stack.of(pinpoint).region,
    channels: ["IN_APP_MESSAGING"],
  },
});
