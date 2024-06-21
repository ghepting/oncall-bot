import {
  PagerDutyOncall,
  PagerDutyUser,
  PagerDutyOncalls,
  PagerDutyUserDetails,
} from "../types/types.ts";

export async function getPrimaryPagerDutyOncallUserFromSchedule(
  schedule_id: PagerDutyOncall["schedule"]["id"],
  api_key: string,
): Promise<PagerDutyUser> {
  const response = await fetch(
    `https://api.pagerduty.com/oncalls?schedule_ids[]=${schedule_id}`,
    {
      headers: {
        "Accept": "application/json",
        "Authorization": `Token token=${api_key}`,
        "Content-Type": "application/json",
      },
    },
  ).catch((error) => {
    throw new Error(`Failed to fetch PagerDuty oncalls: ${error}`);
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch PagerDuty oncalls: ${response.statusText}`,
    );
  }

  const json: PagerDutyOncalls = await response.json()

  const pagerdutyOncall = json.oncalls.find((oncall: PagerDutyOncall) => {
    return oncall.escalation_level === 1 && oncall.schedule.id === schedule_id;
  });

  if (!pagerdutyOncall) {
    throw new Error(
      `No PagerDuty oncall user found for schedule ID: ${schedule_id}`,
    );
  }

  return pagerdutyOncall.user;
}

export async function getPagerDutyUserEmail(
  user: PagerDutyUser,
  api_key: string,
): Promise<string> {
  const response = await fetch(user.self, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Token token=${api_key}`,
      "Content-Type": "application/json",
    },
  }).catch((error) => {
    throw new Error(`Failed to fetch PagerDuty user details: ${error}`);
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch PagerDuty user details: ${response.statusText}`,
    );
  }

  const json: PagerDutyUserDetails = await response.json();

  return json.user.email;
}