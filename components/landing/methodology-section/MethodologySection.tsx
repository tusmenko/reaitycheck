import { DataFreshnessIndicator } from "@/components/custom/data-freshness-indicator";
import type { MethodologySectionProps } from "./MethodologySection.types";
import { STEPS } from "./MethodologySection.constants";

export const MethodologySection = ({ lastUpdated }: MethodologySectionProps) => {
  return (
    <section className="py-16">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">How It Works</h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.number} className="flex gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {step.number}
            </div>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <DataFreshnessIndicator lastUpdated={lastUpdated} />
      </div>
    </section>
  );
};
