import { Skull, Target, Swords } from "lucide-react";

export const TOUGHEST_BREAKER_RANKS = [
  { Icon: Skull, iconColor: "text-red-400" },
  { Icon: Target, iconColor: "text-orange-400" },
  { Icon: Swords, iconColor: "text-slate-400" },
] as const;

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
