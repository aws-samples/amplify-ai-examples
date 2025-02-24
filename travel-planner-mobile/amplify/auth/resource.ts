import { defineAuth } from "@aws-amplify/backend";
import { preSignUp } from "./pre-sign-up/resource";

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailSubject: "Welcome to the your sample app!",
      verificationEmailBody: (code) =>
        `Your verification code is for Amplify AI Travel Planner: ${code()}`,
      verificationEmailStyle: "CODE",
    },
  },
  userAttributes: {
    preferredUsername: {
      required: true,
      mutable: true,
    },
  },
  triggers: {
    preSignUp,
  },
});
