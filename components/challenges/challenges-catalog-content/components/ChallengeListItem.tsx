import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MemenessStars } from "@/components/custom/memeness-stars";
import {
  formatCategory,
  killRateColorClass,
} from "@/lib/model-detail-utils";
import type { TestCase } from "@/lib/types";

interface ChallengeListItemProps {
  test: TestCase;
  rank: number;
}

export const ChallengeListItem = ({ test, rank }: ChallengeListItemProps) => {
  const killRate = test.killRate ?? null;
  const killRateLabel = killRate != null ? `${killRate}%` : "—";
  const killRateClass = killRate != null
    ? killRateColorClass(killRate)
    : "text-muted-foreground";

  const killRateCard = (
    <div className="
      shrink-0 border-4 border-black bg-background px-3 py-2
      dark:border-foreground
    ">
      <div className="text-[10px] font-bold text-muted-foreground uppercase">
        Kill rate
      </div>
      <div className={`
        font-mono text-lg font-bold
        ${killRateClass}
      `}>
        {killRateLabel}
      </div>
    </div>
  );

  return (
    <li>
      <Link
        href={`/challenges/${test.slug}`}
        className="
          flex flex-row items-stretch gap-3 border-4 border-black bg-card px-6
          py-4 text-foreground shadow-brutalist-sm transition-all
          hover:translate-1 hover:shadow-none
          sm:gap-4
          dark:border-foreground
        "
      >
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="flex min-w-0 flex-nowrap items-center gap-2">
            <span className="
              inline-flex shrink-0 items-center border-2 border-black
              bg-neon-yellow px-2.5 py-1 text-xs font-bold text-black
              dark:border-foreground
            ">
              #{rank}
            </span>
            <span className="truncate font-bold">
              {test.name}
            </span>
          </div>
          <div className="
            flex flex-nowrap items-center justify-between gap-2
            sm:justify-start
          ">
            <div className="
              flex min-w-0 flex-col gap-2
              sm:flex-row sm:flex-wrap sm:items-center sm:gap-2
            ">
              <span className="
                w-fit shrink-0 border-2 border-black bg-muted px-2 py-0.5
                text-xs font-bold text-muted-foreground uppercase
                dark:border-foreground
              ">
                {formatCategory(test.category)}
              </span>
              <MemenessStars score={test.memenessScore} />
            </div>
            <div className="
              shrink-0
              sm:hidden
            ">
              {killRateCard}
            </div>
          </div>
        </div>

        <div className="
          hidden shrink-0 items-center
          sm:flex
        ">
          {killRateCard}
        </div>

        <div className="
          flex shrink-0 items-center pl-3
          sm:pl-4
        ">
          <ChevronRight className="size-5 text-muted-foreground" />
        </div>
      </Link>
    </li>
  );
};
