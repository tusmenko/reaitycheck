import Link from "next/link";
import { formatCategory, passRateColorClass } from "@/lib/model-detail-utils";
import { TOUGHEST_BREAKER_RANKS } from "../ProviderDetailPage.constants";

interface TestEntry {
  test: {
    _id: string;
    slug: string;
    name: string;
    category: string;
  };
  providerPassRate: number;
}

interface ProviderToughestBreakersSectionProps {
  toughestBreakers: TestEntry[];
}

export const ProviderToughestBreakersSection = ({
  toughestBreakers,
}: ProviderToughestBreakersSectionProps) => {
  if (toughestBreakers.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">Toughest Breakers</h2>
      <div
        className={`
          grid gap-8
          ${
          toughestBreakers.length === 1
            ? "grid-cols-1"
            : toughestBreakers.length === 2
              ? `
                grid-cols-1
                md:grid-cols-2
              `
              : `
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
              `
        }
        `}
      >
        {toughestBreakers.map((entry, index) => {
          const rank = index + 1;
          const { Icon, iconColor } = TOUGHEST_BREAKER_RANKS[index];
          const passRatePct = Math.round(entry.providerPassRate * 100);
          return (
            <Link
              key={entry.test._id}
              href={`/challenges/${entry.test.slug}`}
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

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="
                      text-xl font-bold text-white transition-colors
                      group-hover:text-accent-red
                    ">
                      {entry.test.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatCategory(entry.test.category)}
                    </p>
                  </div>

                  <span className="
                    inline-flex items-center rounded-full border border-dark-300
                    bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300
                  ">
                    #{rank}
                  </span>
                </div>

                <div className="
                  mt-auto rounded-xl border border-dark-200 bg-dark-50 p-4
                ">
                  <div className="
                    mb-2 text-xs font-semibold text-gray-500 uppercase
                  ">
                    Pass rate (provider)
                  </div>
                  <div
                    className={`
                      text-2xl font-bold
                      ${passRateColorClass(passRatePct)}
                    `}
                  >
                    {passRatePct}%
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
