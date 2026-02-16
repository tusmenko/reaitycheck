export function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s =
    slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/providers/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

export const PROVIDER_STYLES: Partial<Record<string, string>> = {
  openai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  anthropic:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  google: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  meta: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  deepseek:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  qwen: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  mistral: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export function passRateColorClass(pct: number): string {
  if (pct <= 25) return "text-red-400";
  if (pct <= 50) return "text-amber-400";
  if (pct <= 75) return "text-yellow-400";
  return "text-brand-500";
}

/** High kill rate = red, low = green. Use for break/kill rate display. */
export function killRateColorClass(pct: number): string {
  if (pct >= 75) return "text-red-400";
  if (pct >= 50) return "text-amber-400";
  if (pct >= 25) return "text-yellow-400";
  return "text-green-400";
}

/**
 * Badge classes for failure/kill rate: bigger % = more red, smaller = more
 * green. Aligns with killRateColorClass thresholds (25/50/75).
 */
export function failureRateBadgeClass(pct: number): string {
  if (pct >= 75) return "border-red-800 bg-red-900/30 text-red-400";
  if (pct >= 50) return "border-amber-800 bg-amber-900/30 text-amber-400";
  if (pct >= 25) return "border-yellow-800 bg-yellow-900/30 text-yellow-400";
  return "border-green-800 bg-green-900/30 text-green-400";
}

/** Resilience bar fill: lower % = red, higher % = green. Returns CSS color. */
export function resilienceBarColor(pct: number): string {
  const hue = 120 * (pct / 100); // 0% → 0 (red), 100% → 120 (green)
  return `hsl(${hue}, 70%, 45%)`;
}

/** Kill/break rate bar fill: lower % = green, higher % = red. Returns CSS color. */
export function killRateBarColor(pct: number): string {
  const hue = 120 * (1 - pct / 100); // 0% → 120 (green), 100% → 0 (red)
  return `hsl(${hue}, 70%, 45%)`;
}

export function formatCategory(category: string) {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function providerDisplayName(provider: string) {
  return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();
}
