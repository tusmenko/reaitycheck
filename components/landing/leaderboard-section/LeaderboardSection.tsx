import { ArrowRight, Award } from "lucide-react";
import Link from "next/link";
import { modelDetailHref } from "@/lib/model-detail-utils";
import { TOP_RANK_ICONS } from "./LeaderboardSection.constants";
import type { LeaderboardSectionProps } from "./LeaderboardSection.types";
import { avatarGradientByRank, rankIconColorByRank } from "./LeaderboardSection.utils";
import { useLeaderboardSection } from "./useLeaderboardSection";

export const LeaderboardSection = ({ leaderboard }: LeaderboardSectionProps) => {
  const { topModels } = useLeaderboardSection(leaderboard);

  return (
    <section id="models" className="relative bg-dark-50 py-20">
      <div className="
        mx-auto w-full max-w-[1440px] px-6
        lg:px-12
      ">
        <div className="mb-16 text-center">
          <span className="
            text-sm font-semibold tracking-wide text-accent-red uppercase
          ">
            Leaderboard
          </span>
          <h2 className="
            mt-2 font-display text-3xl font-bold text-white
            lg:text-4xl
          ">
            Top Survivors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Models ranked by how often they survive our challenge sets.
          </p>
        </div>

        <div className="
          grid grid-cols-1 gap-8
          md:grid-cols-2
          lg:grid-cols-3
        ">
          {topModels.map((entry) => {
            const success = Math.round(entry.successRate * 100);
            const failure = Math.max(0, 100 - success);
            const initials = entry.model.modelName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");
            const RankIcon = TOP_RANK_ICONS[entry.rank] ?? Award;
            const avatarGradient = avatarGradientByRank(entry.rank);
            const rankIconColor = rankIconColorByRank(entry.rank);

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
                <article className="
                  relative flex h-full flex-col overflow-hidden rounded-3xl
                  border border-dark-200 bg-dark-100 p-8 shadow-card
                  transition-all duration-300
                  hover:border-dark-300 hover:shadow-hover
                ">
                  <div className="
                    absolute top-6 right-6 opacity-5 transition-opacity
                    group-hover:opacity-10
                  ">
                    <RankIcon className={`
                      size-24
                      ${rankIconColor}
                    `} />
                  </div>

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                          flex h-14 min-h-14 w-14 min-w-14 shrink-0 items-center
                          justify-center rounded-2xl bg-linear-to-br text-sm
                          font-bold text-white shadow-lg
                          ${avatarGradient}
                        `}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="
                          text-xl font-bold text-white transition-colors
                          group-hover:text-accent-red
                        ">
                          {entry.model.modelName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {entry.model.provider}
                        </p>
                      </div>
                    </div>

                    <span className="
                      inline-flex items-center rounded-full border
                      border-dark-300 bg-dark-200 px-2.5 py-1 text-xs
                      font-medium text-gray-300
                    ">
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="
                      rounded-xl border border-dark-200 bg-dark-50 p-4
                    ">
                      <div className="
                        mb-2 text-xs font-semibold text-gray-500 uppercase
                      ">
                        Survived
                      </div>
                      <div className="text-2xl font-bold text-brand-500">
                        {success}%
                      </div>
                    </div>
                    <div className="
                      rounded-xl border border-dark-200 bg-dark-50 p-4
                    ">
                      <div className="
                        mb-2 text-xs font-semibold text-gray-500 uppercase
                      ">
                        Failure Rate
                      </div>
                      <div className="text-2xl font-bold text-accent-red">
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
              group flex flex-col items-center justify-center rounded-3xl border
              border-dark-200 bg-dark-100 p-8 text-center shadow-card
              transition-all duration-300
              hover:border-dark-300 hover:shadow-hover
            "
          >
            <div className="
              mb-6 flex h-16 w-16 items-center justify-center rounded-full
              border border-dark-200 bg-dark-50 transition-transform
              group-hover:scale-110
            ">
              <ArrowRight className="
                h-5 w-5 text-gray-500
                group-hover:text-accent-red
              " />
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">
              View benchmark table
            </h3>
            <p className="text-sm text-gray-500">
              See the full ranking and stats
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};
