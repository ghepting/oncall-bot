import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { GetPrimaryOncallData } from "../functions/get_primary_oncall_data.ts";

const workflow = DefineWorkflow({
  callback_id: "tagOncall",
  title: "Tag current oncall engineer in thread when @oncall bot is mentioned.",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.slack.types.message_ts },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "messageTs", "userId"],
  },
});

// Call PagerDuty's API to lookup current oncall engineer
const primaryOncallData = workflow.addStep(
  GetPrimaryOncallData,
  {
    channelId: workflow.inputs.channelId,
    messageTs: workflow.inputs.messageTs,
    userId: workflow.inputs.userId,
  },
);

// Invite the oncall engineer to the channel
workflow.addStep(Schema.slack.functions.InviteUserToChannel, {
  channel_ids: [workflow.inputs.channelId],
  user_ids: [primaryOncallData.outputs.primaryOncallSlackUserId],
});

workflow.addStep(Schema.slack.functions.ReplyInThread, {
  message: primaryOncallData.outputs.message,
  message_context: {
    channel_id: workflow.inputs.channelId,
    message_ts: workflow.inputs.messageTs,
  },
});

export default workflow;
