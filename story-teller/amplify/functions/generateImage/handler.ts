import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import type { Schema } from "../../data/resource";
import { env } from "$amplify/env/generateImage";

export const handler: Schema["generateImage"]["functionHandler"] = async (
  event
) => {
  const client = new BedrockRuntimeClient({ region: env.REGION });
  const res = await client.send(
    new InvokeModelCommand({
      modelId: env.MODEL_ID,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt: event.arguments.prompt,
        mode: "text-to-image",
        aspect_ratio: "1:1",
        output_format: "jpeg",
      }),
    })
  );

  const jsonString = new TextDecoder().decode(res.body);
  const output = JSON.parse(jsonString);

  return output.images;
};
