import { Award } from "lucide-react";
import Link from "next/link";
import { modelDetailHref } from "@/lib/model-detail-utils";
import {
  AVATAR_GRADIENT_BY_RANK,
  RANK_ICON_COLOR_BY_RANK,
} from "../ProviderDetailPage.constants";

interface ModelEntry {
  model: {
    _id: string;
    modelName: string;
    provider: string;
    slug?: string;
    apiIdentifier: string;
  };
  rank: number;
  successRate: number;
}

interface ProviderModelsGridProps {
  entries: ModelEntry[];
}

const getAvatarGradient = (rank: number): string => {
  return AVATAR_GRADIENT_BY_RANK[rank] ?? "from-dark-300 to-dark-500";
};

const getRankIconColor = (rank: number): string => {
  return RANK_ICON_COLOR_BY_RANK[rank] ?? "text-white";
};

const getModelInitials = (modelName: string): string => {
  return modelName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const ProviderModelsGrid = ({ entries }: ProviderModelsGridProps) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">Models</h2>
      <div className="
        grid grid-cols-1 gap-8
        md:grid-cols-2
        lg:grid-cols-3
      ">
        {entries.map((entry) => {
          const success = Math.round(entry.successRate * 100);
          const failure = Math.max(0, 100 - success);
          const initials = getModelInitials(entry.model.modelName);
          const avatarGradient = getAvatarGradient(entry.rank);
          const rankIconColor = getRankIconColor(entry.rank);

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
                relative flex h-full flex-col overflow-hidden rounded-3xl border
                border-dark-200 bg-dark-100 p-8 shadow-card transition-all
                duration-300
                hover:border-dark-300 hover:shadow-hover
              ">
                <div className="
                  absolute top-6 right-6 opacity-5 transition-opacity
                  group-hover:opacity-10
                ">
                  <Award className={`
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
                        {entry.model.provider}
                      </p>
                    </div>
                  </div>

                  <span className="
                    inline-flex items-center rounded-full border border-dark-300
                    bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300
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
      </div>
    </section>
  );
};
