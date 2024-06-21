# @oncall bot

Oncall bot responds to @oncall app mentions and tags whatever engineer is the current primary oncall in a thread. This helps route important/urgent messages to the right engineer without people having to refer to PagerDuty or any other sources to figure out who's currently oncall. This is especially helpful when there are ad hoc schedule overrides and around shift changes, etc.

### Deployment

```bash
slack deploy --team TF4TV0V9V # owner-workspace-hq
```

### Environment Variables

In local development environment variables can be set in the `.env` file:

```
PAGERDUTY_SCHEDULE_ID=PD1202L
PAGERDUTY_API_KEY=<YOUR_API_KEY_GOES_HERE>
```

**In production, environment variables are managed via CLI.**

List environment variables that are configured in production:

```bash
slack env list --team TF4TV0V9V
```

This will return something that looks like:

```bash
 APP  A079W7QNHFS
✨  There are 2 variables stored in this environment

   PAGERDUTY_API_KEY: ******
   PAGERDUTY_SCHEDULE_ID: ******
```

To update an environment variable, use the Slack CLI command `slack env add`:

```bash
slack env add --team TF4TV0V9V PAGERDUTY_API_KEY <YOUR_API_KEY_GOES_HERE>
```