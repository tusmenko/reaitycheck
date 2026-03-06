import { formatDistanceToNow } from "date-fns";

export const useHeroSection = (lastUpdated: Date, nowMs: number) => {
  const freshness = formatDistanceToNow(lastUpdated, { addSuffix: true });
  const hoursSinceUpdate =
    nowMs > 0
      ? (nowMs - lastUpdated.getTime()) / (60 * 60 * 1000)
      : Infinity;
  const isFresh = nowMs > 0 && hoursSinceUpdate < 12;

  return { freshness, isFresh };
};
