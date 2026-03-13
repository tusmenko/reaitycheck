import { Award } from "lucide-react";
import Link from "next/link";
import { modelDetailHref } from "@/lib/model-detail-utils";
import {
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

const getRankIconColor = (rank: number): string => {
  return RANK_ICON_COLOR_BY_RANK[rank] ?? "text-foreground";
};

const getModelInitials = (modelName: string): string => {
  return modelName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

const CARD_SHADOWS = [
  "shadow-[8px_8px_0px_#E63946]",
  "shadow-[8px_8px_0px_#457B9D]",
  "shadow-[8px_8px_0px_#2A9D8F]",
  "shadow-[8px_8px_0px_#F4A261]",
  "shadow-[8px_8px_0px_#8B5CF6]",
  "shadow-[8px_8px_0px_#E76F51]",
];

export const ProviderModelsGrid = ({
  entries,
}: ProviderModelsGridProps) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold uppercase">Models</h2>
      <div className="
        grid grid-cols-1 gap-8
        md:grid-cols-2
        lg:grid-cols-3
      ">
        {entries.map((entry, i) => {
          const success = Math.round(entry.successRate * 100);
          const failure = Math.max(0, 100 - success);
          const initials = getModelInitials(entry.model.modelName);
          const rankIconColor = getRankIconColor(entry.rank);
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
                  <Award className={`
                    size-24
                    ${rankIconColor}
                  `} />
                </div>

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="
                      flex size-14 min-h-14 min-w-14 shrink-0 items-center
                      justify-center border-4 border-black bg-neon-blue text-sm
                      font-bold text-white shadow-[3px_3px_0px_#000]
                      dark:border-foreground
                    ">
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
                        {entry.model.provider}
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
                    <div className="font-mono text-2xl font-bold text-neon-pink">
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
