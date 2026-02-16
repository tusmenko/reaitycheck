import { Skull, Target, Swords } from "lucide-react";

export const TOUGHEST_BREAKER_RANKS = [
  { Icon: Skull, iconColor: "text-red-400" },
  { Icon: Target, iconColor: "text-orange-400" },
  { Icon: Swords, iconColor: "text-slate-400" },
] as const;
