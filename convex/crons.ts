import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "orchestrate all tests",
  { hourUTC: 3, minuteUTC: 0 },
  api.actions.runTests.orchestrateAllTests
);

export default crons;
