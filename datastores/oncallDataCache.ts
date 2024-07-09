import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "oncallDataCache",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string, // PagerDuty schedule ID (ex: "PFMKLVZ")
    },
    summary: {
      type: Schema.types.string, // "Josh Samuels"
    },
    email: {
      type: Schema.types.string, // "josh.samuels@owner.com"
    },
    slackUserId: {
      type: Schema.slack.types.user_id, // "U01A5JZ6X6Z"
    },
    ttl: {
      type: Schema.slack.types.timestamp, // "2024-07-08T20:00:00Z"
    },
  },
  time_to_live_attribute: "ttl",
});
