import Image from "next/image";
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
      <div className="flex items-center justify-center gap-3">
        <Image
          src="/icon.svg"
          alt="ReAIity Check"
          width={56}
          height={56}
          className="h-12 w-12 sm:h-14 sm:w-14"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          ReAIity Check
        </h1>
      </div>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Know your tools&apos; limitations.
      </p>
      <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
        We run the same edge-case and viral failure prompts across popular
        models, surface where they consistently fail, and track results over
        time. Built with AI agents to see where they mislead — full
        transparency.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-sm font-medium text-muted-foreground">
        Track progress until agents can solve simple edge-case problems at least
        as reliably as humans.
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
