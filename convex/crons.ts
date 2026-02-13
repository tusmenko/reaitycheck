import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "run all tests",
  { hourUTC: 3, minuteUTC: 0 },
  api.actions.runTests.runAllTests
);

export default crons;
