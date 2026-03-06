import type { LeaderboardEntry } from "@/lib/types";
import { MAX_TOP_MODELS } from "./LeaderboardSection.constants";

export const useLeaderboardSection = (leaderboard: LeaderboardEntry[]) => {
  const topModels = leaderboard.slice(0, MAX_TOP_MODELS);

  return { topModels };
};
