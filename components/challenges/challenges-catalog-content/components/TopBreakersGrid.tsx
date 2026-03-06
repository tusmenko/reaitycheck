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

export const TopBreakersGrid = ({ tests }: TopBreakersGridProps) => {
  if (tests.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 mb-12">
      <h2 className="mb-4 text-xl font-semibold text-white">
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
            killRate != null ? killRateColorClass(killRate) : "text-gray-500";

          return (
            <Link
              key={test._id}
              href={`/challenges/${test.slug}`}
              className="group block h-full"
            >
              <article className="
                relative flex h-full flex-col overflow-hidden rounded-3xl border
                border-dark-200 bg-dark-100 p-8 shadow-card transition-all
                duration-300
                hover:border-dark-300 hover:shadow-hover
              ">
                <div
                  className={`
                    absolute top-6 right-6 opacity-5 transition-opacity
                    group-hover:opacity-10
                    ${iconColor}
                  `}
                >
                  <Icon className="size-24" />
                </div>

                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="
                      text-xl font-bold text-white transition-colors
                      group-hover:text-accent-red
                    ">
                      {test.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatCategory(test.category)}
                    </p>
                  </div>
                  <span className="
                    inline-flex shrink-0 items-center rounded-full border
                    border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium
                    text-gray-300
                  ">
                    #{rank}
                  </span>
                </div>

                <p className="mb-6 line-clamp-2 text-sm text-gray-500">
                  {test.explanation || test.prompt}
                </p>

                <div className="
                  mt-auto rounded-xl border border-dark-200 bg-dark-50 p-4
                ">
                  <div className="
                    mb-2 text-xs font-semibold text-gray-500 uppercase
                  ">
                    Kill rate
                  </div>
                  <div className={`
                    text-2xl font-bold
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
