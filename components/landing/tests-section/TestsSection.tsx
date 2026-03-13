import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCategory } from "@/lib/model-detail-utils";
import type { TestsSectionProps } from "./TestsSection.types";
import { useTestsSection } from "./useTestsSection";

const GRAIN_BG =
  // eslint-disable-next-line max-len
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E\")";

const CARD_SHADOWS = [
  "shadow-[8px_8px_0px_#E63946]",
  "shadow-[8px_8px_0px_#457B9D]",
  "shadow-[8px_8px_0px_#F4A261]",
  "shadow-[8px_8px_0px_#2A9D8F]",
  "shadow-[8px_8px_0px_#8B5CF6]",
  "shadow-[8px_8px_0px_#E76F51]",
];

export const TestsSection = ({ tests }: TestsSectionProps) => {
  const { featuredChallenges, getKillRateDisplay } = useTestsSection(tests);

  return (
    <section
      id="challenges"
      className="
        relative border-t-4 border-black bg-background py-20
        dark:border-foreground
      "
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN_BG,
          backgroundSize: "256px 256px",
        }}
      />

      <div className="
        relative z-10 mx-auto w-full max-w-[1440px] px-6
        lg:px-12
      ">
        <div className="mb-16 text-center">
          <span className="
            inline-block rotate-1 border-4 border-black bg-neon-orange px-3 py-1
            text-xs font-bold tracking-wide text-white uppercase
            shadow-[3px_3px_0px_#000]
            dark:border-foreground
          ">
            The Gauntlet
          </span>
          <h2 className="
            mt-4 font-display text-3xl font-bold text-foreground uppercase
            lg:text-4xl
          ">
            Deadly Challenges
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-muted-foreground">
            Prompt suites engineered to expose common model failure modes.
          </p>
        </div>

        <div className="
          grid grid-cols-1 gap-6
          md:grid-cols-2
          lg:grid-cols-3
        ">
          {featuredChallenges.map((test, i) => {
            const { killRate, hasRealKillRate } = getKillRateDisplay(test);
            const cardShadow = CARD_SHADOWS[i % CARD_SHADOWS.length];

            return (
              <Link
                key={test._id}
                href={`/challenges/${test.slug}`}
                className={`
                  group border-4 border-black bg-card p-6 transition-all
                  duration-200
                  hover:translate-2 hover:shadow-none
                  dark:border-foreground
                  ${cardShadow}
                `}
              >

                <h3 className="
                  mb-2 text-lg font-bold text-foreground uppercase
                  transition-colors
                  group-hover:text-neon-pink
                ">
                  {test.name}
                </h3>

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="
                    border-2 border-black bg-muted px-3 py-1 text-xs font-bold
                    tracking-wide text-muted-foreground uppercase
                    dark:border-foreground
                  ">
                    {formatCategory(test.category)}
                  </div>
                </div>

                <p className="
                  mb-6 line-clamp-2 font-mono text-sm text-muted-foreground
                ">
                  {test.explanation || test.prompt}
                </p>

                <div className="
                  border-t-4 border-black pt-4
                  dark:border-foreground
                ">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="
                      text-xs font-bold text-muted-foreground uppercase
                    ">
                      Kill Rate
                    </span>
                    <span className="font-mono text-sm font-bold text-neon-pink">
                      {hasRealKillRate ? `${killRate}%` : "—"}
                    </span>
                  </div>
                  {hasRealKillRate && (
                    <div className="
                      h-3 w-full border-2 border-black bg-muted
                      dark:border-foreground
                    ">
                      <div
                        className="h-full bg-neon-pink"
                        style={{ width: `${killRate}%` }}
                      />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}

          <Link
            href="/challenges"
            className="
              group flex flex-col items-center justify-center border-4
              border-black bg-card p-6 text-center shadow-brutalist
              transition-all duration-200
              hover:translate-2 hover:shadow-none
              dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
            "
          >
            <div className="
              mb-4 flex size-16 items-center justify-center border-4
              border-black bg-background transition-transform
              group-hover:scale-110
              dark:border-foreground
            ">
              <ArrowRight className="
                size-5 text-muted-foreground
                group-hover:text-neon-pink
              " />
            </div>
            <h3 className="mb-1 text-lg font-bold text-foreground uppercase">
              View All Challenges
            </h3>
            <p className="font-mono text-sm text-muted-foreground">
              Browse the complete test catalog
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};
