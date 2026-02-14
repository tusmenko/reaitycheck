import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// Schedule daily test orchestration only when CRON_ORCHESTRATE_TESTS_UTC is set
// (Convex Dashboard → Settings → Environment Variables). Format: "HH:mm" UTC, e.g. "12:00".
// Leave unset in Dev to disable auto-run. Manual run: Dashboard → Functions → runTests → orchestrateAllTests.
const cronTime = process.env.CRON_ORCHESTRATE_TESTS_UTC;
if (cronTime) {
  const match = cronTime.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (match) {
    const hourUTC = parseInt(match[1], 10);
    const minuteUTC = parseInt(match[2], 10);
    if (hourUTC >= 0 && hourUTC <= 23 && minuteUTC >= 0 && minuteUTC <= 59) {
      crons.daily(
        "orchestrate all tests",
        { hourUTC, minuteUTC },
        api.actions.runTests.orchestrateAllTests
      );
    }
  }
}

export default crons;
