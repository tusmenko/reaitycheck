"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { providerDisplayName } from "@/lib/model-detail-utils";
import type { ModelsOverviewContentProps } from "./ModelsOverviewContent.types";
import { providerPageHref } from "./ModelsOverviewContent.utils";
import { useModelsOverviewContent } from "./useModelsOverviewContent";

export const ModelsOverviewContent = (props: ModelsOverviewContentProps) => {
  const { providers } = useModelsOverviewContent(props);

  return (
    <div className="relative bg-background">
      <main className="
        relative z-10 px-6 pt-8 pb-16
        lg:px-12
      ">
        <section className="relative z-10 mx-auto w-full max-w-3xl">
          <span className="
            inline-block rotate-1 border-4 border-black bg-neon-green px-3 py-1
            text-xs font-bold tracking-wide text-white uppercase
            shadow-[3px_3px_0px_#000]
            dark:border-foreground
          ">
            Providers
          </span>
          <h1 className="
            mt-4 font-display text-4xl font-bold text-foreground uppercase
            lg:text-5xl
          ">
            Models by provider
          </h1>
          <p className="
            mt-4 font-mono text-base text-muted-foreground
            lg:text-lg
          ">
            Select a provider to see its models and how they perform on
            our challenge suites.
          </p>

          <ul className="mt-10 space-y-3">
            {providers.map((provider) => (
              <li key={provider}>
                <Link
                  href={providerPageHref(provider)}
                  className="
                    flex items-center justify-between border-4 border-black
                    bg-card px-6 py-4 font-bold text-foreground
                    shadow-brutalist-sm transition-all
                    hover:translate-1 hover:shadow-none
                    dark:border-foreground
                  "
                >
                  <span className="uppercase">
                    {providerDisplayName(provider)}
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>

          {providers.length === 0 && (
            <p className="mt-8 font-mono text-muted-foreground">
              No providers discovered yet. Run the benchmark to
              populate data.
            </p>
          )}

        </section>
      </main>
    </div>
  );
};
