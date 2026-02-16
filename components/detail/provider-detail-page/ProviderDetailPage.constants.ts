import { Trophy, Brain, Bot } from "lucide-react";

// Re-export shared constant for component-level imports
export { TOUGHEST_BREAKER_RANKS } from "@/lib/shared-constants";

export const AVATAR_GRADIENT_BY_RANK: Record<number, string> = {
  1: "from-orange-400 to-red-500",
  2: "from-purple-500 to-indigo-600",
  3: "from-gray-600 to-gray-800",
};

export const RANK_ICON_COLOR_BY_RANK: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

export const TOP_RANK_ICONS = {
  1: Trophy,
  2: Brain,
  3: Bot,
};
