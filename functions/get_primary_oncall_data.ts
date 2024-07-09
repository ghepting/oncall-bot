import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import {
  getPagerDutyUserEmail,
  getPrimaryPagerDutyOncallUserFromSchedule,
} from "../lib/pagerduty.ts";
import oncallDataCache from "../datastores/oncallDataCache.ts";

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
    let primaryOncallSlackUserId: string;

    const getResponse = await client.apps.datastore.get<
      typeof oncallDataCache.definition
    >({
      datastore: "oncallDataCache",
      id: env.PAGERDUTY_SCHEDULE_ID,
    });

    if (!getResponse.ok || !getResponse.item || !getResponse.item.slackUserId) {
      // get current oncall's pagerduty user
      const primaryOncallUser = await getPrimaryPagerDutyOncallUserFromSchedule(
        env.PAGERDUTY_SCHEDULE_ID,
        env.PAGERDUTY_API_KEY,
        env.SLACK_SERVICE_TOKEN,
      );

      // get current oncall's email address
      const primaryOncallEmail = await getPagerDutyUserEmail(
        primaryOncallUser,
        env.PAGERDUTY_API_KEY,
      );

      // get current oncall's slack user
      primaryOncallSlackUserId = await client.users.lookupByEmail({
        email: primaryOncallEmail,
      }).then((response) => response.user.id).catch((error) => {
        throw new Error(`Failed to fetch Slack user: ${error}`);
      });

      const fiveMinutesFromNow = new Date(new Date().getTime() + 5 * 60000);
      const ttl = Math.floor(fiveMinutesFromNow.getTime() / 1000);

      // save oncall data to cache with 5 minute TTL
      const putResponse = await client.apps.datastore.put<
        typeof oncallDataCache.definition
      >({
        datastore: "oncallDataCache",
        item: {
          id: env.PAGERDUTY_SCHEDULE_ID,
          summary: primaryOncallUser.summary,
          email: primaryOncallEmail,
          slackUserId: primaryOncallSlackUserId,
          ttl, // 5 minutes from now as Unix timestamp
        },
      });

      // log error if failed to save oncall data to cache
      if (!putResponse.ok) {
        console.error(
          `Failed to save oncall data to cache: ${putResponse.error}`,
        );
      }
    } else {
      // log that oncall data was found in cache
      console.log("Found oncall data in cache");
      // get current oncall's slack user ID from cache
      primaryOncallSlackUserId = getResponse.item.slackUserId;
    }

    const message =
      `:pagerduty: <@${primaryOncallSlackUserId}> @oncall tagged by <@${inputs.userId}> :point_up:`;

    if (!primaryOncallSlackUserId) {
      throw new Error("Failed to fetch primary oncall data");
    }

    return {
      outputs: {
        message,
        primaryOncallSlackUserId,
      },
    };
  },
);
