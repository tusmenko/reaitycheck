import type { HeroSectionProps } from "./HeroSection.types";
import { useHeroSection } from "./useHeroSection";

const GRAIN_BG =
  // eslint-disable-next-line max-len
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E\")";

export const HeroSection = ({
  modelCount,
  testCount,
  providerCount,
  lastUpdated,
  nowMs = 0,
}: HeroSectionProps) => {
  const { freshness, isFresh } = useHeroSection(lastUpdated, nowMs);

  return (
    <section className="
      relative bg-background pt-16 pb-20
      lg:py-28
    ">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_BG,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="
        relative z-10 mx-auto w-full max-w-[1440px] px-6 text-center
        lg:px-12
      ">
        <div className="
          mb-8 inline-flex -rotate-1 items-center gap-2 border-4 border-black
          bg-neon-yellow px-4 py-2 text-xs font-bold tracking-wider text-black
          uppercase shadow-brutalist-sm
          dark:border-foreground dark:shadow-[4px_4px_0px_#f5f5f0]
        ">
          <span
            className={`
              size-2 animate-pulse
              ${isFresh ? "bg-neon-green" : "bg-neon-pink"
              }
            `}
          />
          Live Benchmarks • Updated {freshness}
        </div>

        <h1 className="
          font-display text-5xl/tight font-bold text-foreground uppercase
          lg:text-7xl
        ">
          Where AI Models <br />
          <span className="
            relative inline-block bg-neon-pink px-4 text-white
            shadow-[6px_6px_0px_#000]
            dark:shadow-[6px_6px_0px_#f5f5f0]
          ">
            Face Reality
          </span>
        </h1>
        <p className="
          mx-auto mt-6 max-w-2xl font-mono text-lg/relaxed text-muted-foreground
          lg:text-xl
        ">
          We run non-trivial prompts across popular models to surface failures
          that benchmark averages hide. No fluff, just edge cases.
          <br />
          And a bit of fun 🧪
        </p>

        <div className="
          mt-10 flex flex-col items-center justify-center gap-4
          sm:flex-row
        ">
          <a
            href="#test-runs"
            className="
              w-full border-4 border-black bg-neon-blue px-8 py-3.5 font-bold
              tracking-wider text-white uppercase shadow-brutalist-sm
              transition-all
              hover:translate-1 hover:shadow-none
              sm:w-auto
              dark:border-foreground dark:shadow-[4px_4px_0px_#f5f5f0]
            "
          >
            View Live Results
          </a>
          <a
            href="#challenges"
            className="
              w-full border-4 border-black bg-card px-8 py-3.5 font-bold
              tracking-wider text-foreground uppercase shadow-brutalist-sm
              transition-all
              hover:translate-1 hover:shadow-none
              sm:w-auto
              dark:border-foreground dark:shadow-[4px_4px_0px_#f5f5f0]
            "
          >
            Explore Challenges
          </a>
        </div>

        <div className="
          mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-t-4 border-black
          pt-8
          md:grid-cols-4
          dark:border-foreground
        ">
          <div className="
            -rotate-1 border-4 border-black bg-card p-4 text-center
            shadow-[4px_4px_0px_#E63946]
            dark:border-foreground
          ">
            <div className="mb-1 font-mono text-3xl font-bold text-foreground">{modelCount}</div>
            <div className="
              text-xs font-bold tracking-wide text-muted-foreground uppercase
            ">
              Models Tracked
            </div>
          </div>
          <div className="
            rotate-1 border-4 border-black bg-card p-4 text-center
            shadow-[4px_4px_0px_#457B9D]
            dark:border-foreground
          ">
            <div className="mb-1 font-mono text-3xl font-bold text-foreground">{testCount}</div>
            <div className="
              text-xs font-bold tracking-wide text-muted-foreground uppercase
            ">
              Active Challenges
            </div>
          </div>
          <div className="
            -rotate-1 border-4 border-black bg-card p-4 text-center
            shadow-[4px_4px_0px_#2A9D8F]
            dark:border-foreground
          ">
            <div className="mb-1 font-mono text-3xl font-bold text-foreground">{providerCount}</div>
            <div className="
              text-xs font-bold tracking-wide text-muted-foreground uppercase
            ">
              Providers
            </div>
          </div>
          <div className="
            rotate-1 border-4 border-black bg-card p-4 text-center
            shadow-[4px_4px_0px_#F4A261]
            dark:border-foreground
          ">
            <div className="mb-1 font-mono text-3xl font-bold text-foreground">Daily</div>
            <div className="
              text-xs font-bold tracking-wide text-muted-foreground uppercase
            ">
              Automated Runs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
