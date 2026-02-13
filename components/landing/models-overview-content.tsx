"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Navbar } from "./navbar";
import { FooterSection } from "./footer-section";
import { ChevronRight } from "lucide-react";

interface ModelsOverviewContentProps {
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
}

function providerDisplayName(provider: string) {
  return provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();
}

function providerPageHref(provider: string) {
  return `/models/${encodeURIComponent(provider)}`;
}

export function ModelsOverviewContent({
  preloadedModels,
}: ModelsOverviewContentProps) {
  const models = usePreloadedQuery(preloadedModels);
  const providers = Array.from(new Set(models.map((m) => m.provider))).sort();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-dark-50">
      <Navbar />
      <main className="relative z-10 min-h-[80vh] px-6 pb-16 pt-28 lg:px-12">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

        <section className="relative z-10 mx-auto w-full max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            Providers
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
            Models by provider
          </h1>
          <p className="mt-4 text-base text-gray-400 lg:text-lg">
            Select a provider to see its models and how they perform on our
            challenge suites.
          </p>

          <ul className="mt-10 space-y-2">
            {providers.map((provider) => (
              <li key={provider}>
                <Link
                  href={providerPageHref(provider)}
                  className="flex items-center justify-between rounded-xl border border-dark-200 bg-dark-100/80 px-6 py-4 text-white shadow-sm transition-all hover:border-accent-red/30 hover:bg-dark-100"
                >
                  <span className="font-semibold">
                    {providerDisplayName(provider)}
                  </span>
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                </Link>
              </li>
            ))}
          </ul>

          {providers.length === 0 && (
            <p className="mt-8 text-gray-500">
              No providers discovered yet. Run the benchmark to populate data.
            </p>
          )}

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-accent-red transition-colors hover:text-accent-orange"
            >
              Back to Homepage
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
}
