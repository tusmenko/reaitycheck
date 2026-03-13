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

const CARD_SHADOWS = [
  "shadow-[8px_8px_0px_#E63946]",
  "shadow-[8px_8px_0px_#457B9D]",
  "shadow-[8px_8px_0px_#2A9D8F]",
];

export const ProviderToughestBreakersSection = ({
  toughestBreakers,
}: ProviderToughestBreakersSectionProps) => {
  if (toughestBreakers.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-bold uppercase">
        Toughest Breakers
      </h2>
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
          const cardShadow =
            CARD_SHADOWS[index % CARD_SHADOWS.length];
          return (
            <Link
              key={entry.test._id}
              href={`/challenges/${entry.test.slug}`}
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

                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="
                      text-xl font-bold text-foreground uppercase
                      transition-colors
                      group-hover:text-neon-pink
                    ">
                      {entry.test.name}
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground">
                      {formatCategory(entry.test.category)}
                    </p>
                  </div>

                  <span className="
                    inline-flex items-center border-2 border-black
                    bg-neon-yellow px-2.5 py-1 text-xs font-bold text-black
                    dark:border-foreground
                  ">
                    #{rank}
                  </span>
                </div>

                <div className="
                  mt-auto border-4 border-black bg-background p-4
                  dark:border-foreground
                ">
                  <div className="
                    mb-2 text-xs font-bold text-muted-foreground uppercase
                  ">
                    Pass rate (provider)
                  </div>
                  <div
                    className={`
                      font-mono text-2xl font-bold
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
