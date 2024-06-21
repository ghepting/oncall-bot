import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import workflowDef from "../workflows/tag_oncall.ts";

const trigger: Trigger<typeof workflowDef.definition> = {
  type: TriggerTypes.Event,
  name: "App Mentioned event trigger",
  description:
    "A trigger to start the tag oncall workflow when @oncall bot is mentioned.",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.AppMentioned,
    all_resources: true,
  },
  inputs: {
    channelId: { value: TriggerContextData.Event.AppMentioned.channel_id },
    messageTs: { value: TriggerContextData.Event.AppMentioned.message_ts },
    userId: { value: TriggerContextData.Event.AppMentioned.user_id },
  },
};

export default trigger;
