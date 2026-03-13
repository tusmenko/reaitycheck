import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { modelDetailHref } from "@/lib/model-detail-utils";
import { TOP_RANK_ICONS } from "./LeaderboardSection.constants";
import type { LeaderboardSectionProps } from "./LeaderboardSection.types";
import { rankIconColorByRank } from "./LeaderboardSection.utils";
import { useLeaderboardSection } from "./useLeaderboardSection";

const CARD_SHADOWS = [
  "shadow-[8px_8px_0px_#E63946]",
  "shadow-[8px_8px_0px_#457B9D]",
  "shadow-[8px_8px_0px_#2A9D8F]",
  "shadow-[8px_8px_0px_#F4A261]",
  "shadow-[8px_8px_0px_#8B5CF6]",
  "shadow-[8px_8px_0px_#E76F51]",
];

export const LeaderboardSection = ({ leaderboard }: LeaderboardSectionProps) => {
  const { topModels } = useLeaderboardSection(leaderboard);

  return (
    <section id="models" className="
      relative border-t-4 border-black bg-muted py-20
      dark:border-foreground
    ">
      <div className="
        mx-auto w-full max-w-[1440px] px-6
        lg:px-12
      ">
        <div className="mb-16 text-center">
          <span className="
            inline-block -rotate-1 border-4 border-black bg-neon-pink px-3 py-1
            text-xs font-bold tracking-wide text-white uppercase
            shadow-[3px_3px_0px_#000]
            dark:border-foreground
          ">
            Leaderboard
          </span>
          <h2 className="
            mt-4 font-display text-3xl font-bold text-foreground uppercase
            lg:text-4xl
          ">
            Top Survivors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-muted-foreground">
            Models ranked by how often they survive our challenge sets.
          </p>
        </div>

        <div className="
          grid grid-cols-1 gap-8
          md:grid-cols-2
          lg:grid-cols-3
        ">
          {topModels.map((entry, i) => {
            const success = Math.round(entry.successRate * 100);
            const failure = Math.max(0, 100 - success);
            const initials = entry.model.modelName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");
            const RankIcon = TOP_RANK_ICONS[entry.rank] ?? Award;
            const rankIconColor = rankIconColorByRank(entry.rank);
            const cardShadow = CARD_SHADOWS[i % CARD_SHADOWS.length];

            return (
              <Link
                key={entry.model._id}
                href={modelDetailHref(
                  entry.model.provider,
                  entry.model.slug,
                  entry.model.apiIdentifier
                )}
                className="group block h-full"
              >
                <article className={`
                  relative flex h-full flex-col overflow-hidden border-4
                  border-black bg-card p-8 transition-all duration-200
                  hover:translate-2 hover:shadow-none
                  dark:border-foreground
                  ${cardShadow}
                `}>
                  <div className="
                    absolute top-6 right-6 opacity-10 transition-opacity
                    group-hover:opacity-20
                  ">
                    <RankIcon className={`
                      size-24
                      ${rankIconColor}
                    `} />
                  </div>

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex size-14 min-h-14 min-w-14 shrink-0 items-center
                          justify-center border-4 border-black bg-neon-blue
                          text-sm font-bold text-white shadow-[3px_3px_0px_#000]
                          dark:border-foreground
                        "
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="
                          text-xl font-bold text-foreground uppercase
                          transition-colors
                          group-hover:text-neon-pink
                        ">
                          {entry.model.modelName}
                        </h3>
                        <p className="font-mono text-sm text-muted-foreground">
                          by {entry.model.provider}
                        </p>
                      </div>
                    </div>

                    <span className="
                      inline-flex items-center border-2 border-black
                      bg-neon-yellow px-2.5 py-1 text-xs font-bold text-black
                      dark:border-foreground
                    ">
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="
                      border-4 border-black bg-background p-4
                      dark:border-foreground
                    ">
                      <div className="
                        mb-2 text-xs font-bold text-muted-foreground uppercase
                      ">
                        Survived
                      </div>
                      <div className="
                        font-mono text-2xl font-bold text-neon-green
                      ">
                        {success}%
                      </div>
                    </div>
                    <div className="
                      border-4 border-black bg-background p-4
                      dark:border-foreground
                    ">
                      <div className="
                        mb-2 text-xs font-bold text-muted-foreground uppercase
                      ">
                        Failure Rate
                      </div>
                      <div className="
                        font-mono text-2xl font-bold text-neon-pink
                      ">
                        {failure}%
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}

          <Link
            href="/benchmark"
            className="
              group flex flex-col items-center justify-center border-4
              border-black bg-card p-8 text-center shadow-brutalist
              transition-all duration-200
              hover:translate-2 hover:shadow-none
              dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
            "
          >
            <div className="
              mb-6 flex size-16 items-center justify-center border-4
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
              View benchmark table
            </h3>
            <p className="font-mono text-sm text-muted-foreground">
              See the full ranking and stats
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};
