import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import workflowDef from "../workflows/tag_oncall.ts";

const trigger: Trigger<typeof workflowDef.definition> = {
  type: TriggerTypes.Event,
  name: "Emoji Reaction event trigger",
  description:
    "A trigger to start the tag oncall workflow when a specific emoji reaction is used.",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.ReactionAdded,
    all_resources: true,
    filter: {
      version: 1,
      root: {
        statement: "{{data.reaction}} == tag-current-primary-oncall",
      },
    },
  },
  inputs: {
    channelId: { value: TriggerContextData.Event.AppMentioned.channel_id },
    messageTs: { value: TriggerContextData.Event.AppMentioned.message_ts },
    userId: { value: TriggerContextData.Event.AppMentioned.user_id },
  },
};

export default trigger;
