import { Manifest } from "deno-slack-sdk/mod.ts";
import tagOncall from "./workflows/tag_oncall.ts";
import { GetPrimaryOncallData } from "./functions/get_primary_oncall_data.ts";

/**
 * Oncall Bot app tags the current oncall engineer in channels.
 * During the open beta period, only public channels are supported.
 * To run this app, a PagerDuty account is required.
 */
export default Manifest({
  name: "oncall",
  description: "A Slack app that tags the current oncall engineer",
  icon: "assets/default_new_app_icon.png",
  functions: [GetPrimaryOncallData],
  workflows: [tagOncall],
  outgoingDomains: ["api.pagerduty.com"],
  botScopes: [
    "commands",
    "app_mentions:read",
    "chat:write",
    "chat:write.public",
    "channels:write.invites",
    "groups:write.invites",
    "reactions:read",
    "triggers:read",
    "triggers:write",
    "channels:join",
    "users:read",
    "users:read.email",
  ],
});
