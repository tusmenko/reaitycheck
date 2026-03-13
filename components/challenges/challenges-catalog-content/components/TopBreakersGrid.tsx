import Link from "next/link";
import {
  formatCategory,
  killRateColorClass,
} from "@/lib/model-detail-utils";
import { TOUGHEST_BREAKER_RANKS } from "@/lib/shared-constants";
import type { TestCase } from "@/lib/types";

interface TopBreakersGridProps {
  tests: TestCase[];
}

const CARD_SHADOWS = [
  "shadow-[8px_8px_0px_#E63946]",
  "shadow-[8px_8px_0px_#457B9D]",
  "shadow-[8px_8px_0px_#2A9D8F]",
];

export const TopBreakersGrid = ({ tests }: TopBreakersGridProps) => {
  if (tests.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 mb-12">
      <h2 className="mb-4 text-xl font-bold text-foreground uppercase">
        Top breakers
      </h2>
      <div className="
        grid grid-cols-1 gap-8
        md:grid-cols-2
        lg:grid-cols-3
      ">
        {tests.map((test, index) => {
          const rank = index + 1;
          const { Icon, iconColor } = TOUGHEST_BREAKER_RANKS[index];
          const killRate = test.killRate ?? null;
          const killRateLabel =
            killRate != null ? `${killRate}%` : "—";
          const killRateClass =
            killRate != null
              ? killRateColorClass(killRate)
              : "text-muted-foreground";
          const cardShadow = CARD_SHADOWS[index % CARD_SHADOWS.length];

          return (
            <Link
              key={test._id}
              href={`/challenges/${test.slug}`}
              className="group block h-full"
            >
              <article className={`
                relative flex h-full flex-col overflow-hidden border-4
                border-black bg-card p-8 transition-all duration-200
                hover:translate-2 hover:shadow-none
                dark:border-foreground
                ${cardShadow}
              `}>
                <div
                  className={`
                    absolute top-6 right-6 opacity-10 transition-opacity
                    group-hover:opacity-20
                    ${iconColor}
                  `}
                >
                  <Icon className="size-24" />
                </div>

                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="
                      text-xl font-bold text-foreground uppercase
                      transition-colors
                      group-hover:text-neon-pink
                    ">
                      {test.name}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground">
                      {formatCategory(test.category)}
                    </p>
                  </div>
                  <span className="
                    inline-flex shrink-0 items-center border-2 border-black
                    bg-neon-yellow px-2.5 py-1 text-xs font-bold text-black
                    dark:border-foreground
                  ">
                    #{rank}
                  </span>
                </div>

                <p className="
                  mb-6 line-clamp-2 font-mono text-sm text-muted-foreground
                ">
                  {test.explanation || test.prompt}
                </p>

                <div className="
                  mt-auto border-4 border-black bg-background p-4
                  dark:border-foreground
                ">
                  <div className="
                    mb-2 text-xs font-bold text-muted-foreground uppercase
                  ">
                    Kill rate
                  </div>
                  <div className={`
                    font-mono text-2xl font-bold
                    ${killRateClass}
                  `}>
                    {killRateLabel}
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
