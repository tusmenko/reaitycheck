import { Badge } from "@/components/ui/badge";
import { DataFreshnessIndicator } from "@/components/custom/data-freshness-indicator";
import { FlaskConical, BrainCircuit } from "lucide-react";

interface HeroSectionProps {
  modelCount: number;
  testCount: number;
  lastUpdated: Date;
}

export function HeroSection({
  modelCount,
  testCount,
  lastUpdated,
}: HeroSectionProps) {
  return (
    <section className="py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        ReAIity Check
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        See Where AI Actually Fails
      </p>
      <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
        AI benchmarks tell you where models excel. We show you where they
        consistently fail — with daily automated testing and full transparency.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
          <BrainCircuit className="h-3.5 w-3.5" />
          {modelCount} Models
        </Badge>
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm">
          <FlaskConical className="h-3.5 w-3.5" />
          {testCount} Tests
        </Badge>
        <DataFreshnessIndicator lastUpdated={lastUpdated} />
      </div>
    </section>
  );
}
