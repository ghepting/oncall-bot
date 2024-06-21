import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getPagerDutyUserEmail,
  getPrimaryPagerDutyOncallUserFromSchedule,
} from "../lib/pagerduty.ts";

export const GetPrimaryOncallData = DefineFunction({
  callback_id: "GetPrimaryOncallData",
  title: "Get data for the current primary oncall engineer",
  source_file: "functions/get_primary_oncall_data.ts",
  input_parameters: {
    properties: {
      channelId: { type: Schema.slack.types.channel_id },
      messageTs: { type: Schema.slack.types.message_ts },
      userId: { type: Schema.slack.types.user_id },
    },
    required: ["channelId", "messageTs", "userId"],
  },
  output_parameters: {
    properties: {
      message: { type: Schema.types.string },
      primaryOncallSlackUserId: { type: Schema.slack.types.user_id },
    },
    required: ["message", "primaryOncallSlackUserId"],
  },
});

export default SlackFunction(
  GetPrimaryOncallData,
  async ({ inputs, client, env }) => {
    // get current oncall's pagerduty user
    const primaryOncallUser = await getPrimaryPagerDutyOncallUserFromSchedule(
      env.PAGERDUTY_SCHEDULE_ID,
      env.PAGERDUTY_API_KEY,
    );

    // get current oncall's email address
    const primaryOncallEmail = await getPagerDutyUserEmail(
      primaryOncallUser,
      env.PAGERDUTY_API_KEY,
    );

    // get current oncall's slack user
    const primaryOncallSlackUser = await client.users.lookupByEmail({
      email: primaryOncallEmail,
    }).then((response) => response.user).catch((error) => {
      throw new Error(`Failed to fetch Slack user: ${error}`);
    });

    const message =
      `:pagerduty: <@${primaryOncallSlackUser.id}> @oncall tagged by <@${inputs.userId}> :point_up:`;

    return {
      outputs: {
        message,
        primaryOncallSlackUserId: primaryOncallSlackUser.id,
      },
    };
  },
);
