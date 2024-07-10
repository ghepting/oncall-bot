import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const workflow = DefineWorkflow({
  callback_id: "hello",
  title: "Introduce oncall bot to the channel when invited",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "userId"],
  },
});

// introduce the oncall bot to the channel
workflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: workflow.inputs.channelId,
  message:
    "Hello, I am the @oncall bot! You can mention @oncall and I will start a thread and tag the current oncall engineer for you.",
});

export default workflow;
