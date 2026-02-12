import { DataFreshnessIndicator } from "@/components/custom/data-freshness-indicator";

const STEPS = [
  {
    number: "1",
    title: "Curate Viral Failures",
    description:
      "We collect well-known AI failure cases — the ones that go viral on social media and highlight real limitations.",
  },
  {
    number: "2",
    title: "Automate Daily Testing",
    description:
      "Every day at 3 AM UTC, each model receives identical prompts under controlled conditions. No cherry-picking.",
  },
  {
    number: "3",
    title: "Validate Responses",
    description:
      "Answers are validated against expected results using exact match, pattern matching, and custom validators.",
  },
  {
    number: "4",
    title: "Track Over Time",
    description:
      "We store every result to monitor whether models improve or regress on specific failure modes.",
  },
];

interface MethodologySectionProps {
  lastUpdated: Date;
}

export function MethodologySection({ lastUpdated }: MethodologySectionProps) {
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
}
