import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemenessStars } from "@/components/custom/memeness-stars";
import type { TestCase } from "@/lib/types";

const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function formatCategory(category: string) {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TestsSectionProps {
  tests: TestCase[];
}

export function TestsSection({ tests }: TestsSectionProps) {
  return (
    <section id="tests" className="py-16">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">The Tests</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((test) => (
          <Card key={test.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base leading-tight">
                  {test.name}
                </CardTitle>
                <MemenessStars score={test.memenessScore} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{formatCategory(test.category)}</Badge>
                <Badge
                  variant="outline"
                  className={DIFFICULTY_STYLES[test.difficulty]}
                >
                  {test.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-mono leading-relaxed line-clamp-3">
                  {test.prompt}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {test.explanation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
