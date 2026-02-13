import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TestRunStatusIcon } from "@/components/custom/test-run-status-icon";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";

function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s = slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/model/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

interface ComparisonGridSectionProps {
  tests: TestCase[];
  models: AIModel[];
  grid: ComparisonCell[];
}

function getResult(
  grid: ComparisonCell[],
  testCaseId: string,
  modelId: string
): ComparisonCell | undefined {
  return grid.find(
    (c) => c.testCaseId === testCaseId && c.modelId === modelId
  );
}

export function ComparisonGridSection({
  tests,
  models,
  grid,
}: ComparisonGridSectionProps) {
  return (
    <section className="py-16">
      <h2 className="mb-8 text-3xl font-bold tracking-tight">
        The Reality Check
      </h2>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-background min-w-[180px]">
                Test
              </TableHead>
              {models.map((model) => (
                <TableHead key={model._id} className="text-center min-w-[120px]">
                  <Link
                    href={modelDetailHref(
                      model.provider,
                      model.slug,
                      model.apiIdentifier
                    )}
                    className="text-xs font-medium leading-tight text-primary underline-offset-4 hover:underline"
                  >
                    {model.modelName}
                  </Link>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test._id}>
                <TableCell className="sticky left-0 z-10 bg-background font-medium">
                  <Link
                    href={`/test/${test.slug}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {test.name}
                  </Link>
                </TableCell>
                {models.map((model) => {
                  const cell = getResult(grid, test._id, model._id);
                  return (
                    <TableCell key={model._id} className="text-center">
                      <span className="inline-flex items-center justify-center">
                        <TestRunStatusIcon cell={cell} />
                      </span>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
