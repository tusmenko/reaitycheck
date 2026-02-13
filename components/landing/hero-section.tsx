import Link from "next/link";

interface HeroSectionProps {
  modelCount: number;
  testCount: number;
  lastUpdated: Date;
  totalPromptRuns?: number;
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return "This week";
  return "Live";
}

export function HeroSection({
  modelCount,
  testCount,
  lastUpdated,
  totalPromptRuns,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
      <div className="pattern-bg absolute inset-0" />
      <div className="absolute -z-10 top-20 right-0 h-[600px] w-[600px] animate-pulse rounded-full bg-accent-red/10 blur-3xl [animation-duration:4s]" />
      <div className="absolute -z-10 bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-orange/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 text-center lg:px-12">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-dark-200 bg-dark-100 px-4 py-2 text-xs font-semibold text-accent-red shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-red" />
          {formatRelative(lastUpdated)} · Live Benchmarks
        </div>

        <h1 className="font-display mb-6 text-5xl font-bold leading-tight text-white lg:text-7xl">
          Where AI Models <br />
          <span className="bg-gradient-to-r from-accent-red via-accent-orange to-accent-red bg-clip-text text-transparent">
            Face Reality
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-dark-500 lg:text-xl">
          We run non-trivial prompts across popular models to surface failures
          that academic benchmarks average out. No fluff, just edge cases.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="#test-runs"
            className="w-full rounded-full bg-gradient-to-r from-accent-red to-accent-orange px-8 py-3.5 font-medium text-white shadow-xl transition-all hover:-translate-y-1 hover:shadow-glow sm:w-auto"
          >
            View Live Results
          </Link>
          <Link
            href="#challenges"
            className="w-full rounded-full border border-dark-200 bg-dark-100 px-8 py-3.5 font-medium text-white shadow-sm transition-all hover:bg-dark-200 hover:shadow-md sm:w-auto"
          >
            Explore Challenges
          </Link>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-t border-dark-200/60 pt-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">
              {modelCount}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide text-dark-500">
              Models Tracked
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">
              {testCount}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide text-dark-500">
              Unique Challenges
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">
              {totalPromptRuns != null
                ? totalPromptRuns >= 1000
                  ? `${(totalPromptRuns / 1000).toFixed(0)}k+`
                  : totalPromptRuns
                : "—"}
            </div>
            <div className="text-sm font-medium uppercase tracking-wide text-dark-500">
              Prompts Run
            </div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-3xl font-bold text-white">Daily</div>
            <div className="text-sm font-medium uppercase tracking-wide text-dark-500">
              Updates
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
