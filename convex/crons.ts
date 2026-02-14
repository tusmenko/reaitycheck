import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "orchestrate all tests",
  { hourUTC: 12, minuteUTC: 0 },
  api.actions.runTests.orchestrateAllTests
);

export default crons;
