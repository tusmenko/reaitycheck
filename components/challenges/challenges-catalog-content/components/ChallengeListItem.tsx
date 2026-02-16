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
    : "text-gray-500";

  const killRateCard = (
    <div className="
      shrink-0 rounded-xl border border-dark-200 bg-dark-50 px-3 py-2
    ">
      <div className="text-[10px] font-semibold text-gray-500 uppercase">
        Kill rate
      </div>
      <div className={`
        text-lg font-bold
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
          flex flex-row items-stretch gap-3 rounded-xl border border-dark-200
          bg-dark-100/80 px-6 py-4 text-white shadow-sm transition-all
          hover:border-accent-red/30 hover:bg-dark-100
          sm:gap-4
        "
      >
        {/* Column 1 (max width): row1 = position + title, 
        row2 = category + memeness (desktop) or [category+meme | kill rate] (mobile) */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
          <div className="flex min-w-0 flex-nowrap items-center gap-2">
            <span className="
              inline-flex shrink-0 items-center rounded-full border
              border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium
              text-gray-300
            ">
              #{rank}
            </span>
            <span className="truncate font-semibold">
              {test.name}
            </span>
          </div>
          {/* Row 2: mobile = two columns (category+meme in column | kill rate); 
          desktop = category + meme in row */}
          <div className="
            flex flex-nowrap items-center justify-between gap-2
            sm:justify-start
          ">
            <div className="
              flex min-w-0 flex-col gap-2
              sm:flex-row sm:flex-wrap sm:items-center sm:gap-2
            ">
              <span className="
                w-fit shrink-0 rounded-sm border border-dark-300 bg-dark-200/80
                px-2 py-0.5 text-xs text-gray-400
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

        {/* Column 2: kill rate — desktop only (middle column) */}
        <div className="
          hidden shrink-0 items-center
          sm:flex
        ">
          {killRateCard}
        </div>

        {/* Column 3: arrow — full height, dedicated column */}
        <div className="
          flex shrink-0 items-center pl-3
          sm:pl-4
        ">
          <ChevronRight className="h-5 w-5 text-gray-500" />
        </div>
      </Link>
    </li>
  );
};
