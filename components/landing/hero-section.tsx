import { formatDistanceToNow } from "date-fns";

interface HeroSectionProps {
  modelCount: number;
  testCount: number;
  providerCount: number;
  lastUpdated: Date;
  /** Current time in ms (for purity); pass from parent so render stays pure. */
  nowMs?: number;
}

export function HeroSection({
  modelCount,
  testCount,
  providerCount,
  lastUpdated,
  nowMs = 0,
}: HeroSectionProps) {
  const freshness = formatDistanceToNow(lastUpdated, { addSuffix: true });
  const hoursSinceUpdate =
    nowMs > 0
      ? (nowMs - lastUpdated.getTime()) / (60 * 60 * 1000)
      : Infinity;
  const isFresh = nowMs > 0 && hoursSinceUpdate < 12;

  return (
    <section className="relative pb-20 pt-16 lg:pb-28 lg:pt-28">
      <div className="pattern-bg absolute inset-0" />
      <div className="absolute right-0 top-20 -z-0 h-[36rem] w-[36rem] rounded-full bg-accent-red/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -z-0 h-[24rem] w-[24rem] rounded-full bg-accent-orange/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 text-center lg:px-12">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-dark-200 bg-dark-100 px-4 py-2 text-xs font-semibold text-accent-red shadow-sm">
          <span
            className={`h-2 w-2 animate-pulse rounded-full ${isFresh ? "bg-green-500" : "bg-accent-red"
              }`}
          />
          Live Benchmarks • Updated {freshness}
        </div>

        <h1 className="font-display text-5xl font-bold leading-tight text-white lg:text-7xl">
          Where AI Models <br />
          <span className="bg-linear-to-r from-accent-red via-accent-orange to-accent-red bg-clip-text text-transparent">
            Face Reality
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 lg:text-xl">
          We run non-trivial prompts across popular models to surface failures
          that benchmark averages hide. No fluff, just edge cases.
          <br />
          And a bit of fun 🧪
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#test-runs"
            className="w-full rounded-full bg-linear-to-r from-accent-red to-accent-orange px-8 py-3.5 font-medium text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-glow sm:w-auto"
          >
            View Live Results
          </a>
          <a
            href="#challenges"
            className="w-full rounded-full border border-dark-200 bg-dark-100 px-8 py-3.5 font-medium text-white transition-all hover:bg-dark-200 sm:w-auto"
          >
            Explore Challenges
          </a>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-t border-dark-200/60 pt-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">{modelCount}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Models Tracked
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">{testCount}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Active Challenges
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">{providerCount}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Providers
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">Daily</div>
            <div className="text-sm font-medium uppercase tracking-wide text-gray-500">
              Automated Runs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
