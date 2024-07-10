import { Trigger } from "deno-slack-sdk/types.ts";
import {
  TriggerContextData,
  TriggerEventTypes,
  TriggerTypes,
} from "deno-slack-api/mod.ts";
import workflowDef from "../workflows/hello.ts";

const trigger: Trigger<typeof workflowDef.definition> = {
  type: TriggerTypes.Event,
  name: "Oncall bot invited to channel",
  description:
    "A trigger for oncall bot to introduce itself when added to a new channel.",
  workflow: `#/workflows/${workflowDef.definition.callback_id}`,
  event: {
    event_type: TriggerEventTypes.UserJoinedChannel,
    all_resources: true,
    filter: {
      // Only trigger when the @oncall bot was added to a channel
      version: 1,
      root: {
        statement: `{{data.user_id}} == ${Deno.env.get("SLACK_APP_ID")}`,
      },
    },
  },
  inputs: {
    channelId: { value: TriggerContextData.Event.UserJoinedChannel.channel_id },
    userId: { value: TriggerContextData.Event.UserJoinedChannel.user_id },
  },
};

export default trigger;
