import type { PreSignUpTriggerHandler } from "aws-lambda";

export const handler: PreSignUpTriggerHandler = async (event) => {
  const email = event.request.userAttributes["email"];

  if (!email.endsWith("gmail.com")) {
    throw new Error("Invalid email domain");
  }

  return event;
};
