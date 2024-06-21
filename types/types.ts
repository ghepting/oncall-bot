export type PagerDutyUser = {
  id: string; // "PFMKLVZ"
  type: "user_reference";
  summary: string; // "Matt Vestal"
  self: string; // URL: "https://api.pagerduty.com/users/PFMKLVZ"
  html_url: string; // URL: "https://owner-com.pagerduty.com/users/PFMKLVZ"
};

export type PagerDutyUserDetails = {
  user: PagerDutyUser & {
    email: string; // "matt.vestal@owner.com"
    // deno-lint-ignore no-explicit-any
    [key: string]: any;
  };
};

export type PagerDutySchedule = {
  id: string; // "PQM9CHO"
  type: "schedule_reference";
  summary: string; // "Owner Primary On-call"
  self: string; // URL: "https://api.pagerduty.com/schedules/PQM9CHO"
  html_url: string; // URL: "https://owner-com.pagerduty.com/schedules/PQM9CHO"
};

export type PagerDutyEscalationPolicy = {
  id: string; // "P00PMXJ"
  type: "escalation_policy_reference";
  summary: string; // "Default"
  self: string; // URL: "https://api.pagerduty.com/escalation_policies/P00PMXJ"
  html_url: string; // URL: "https://owner-com.pagerduty.com/escalation_policies/P00PMXJ"
};

export type PagerDutyOncall = {
  escalation_policy: PagerDutyEscalationPolicy;
  escalation_level: number; // 1
  schedule: PagerDutySchedule;
  user: PagerDutyUser;
  start: string; // "2024-06-17T18:30:00Z"
  end: string; // "2024-06-17T18:30:00Z"
};

export type PagerDutyOncalls = {
  oncalls: PagerDutyOncall[];
  limit: number;
  offset: number;
  more: boolean;
  total: number | null;
};
