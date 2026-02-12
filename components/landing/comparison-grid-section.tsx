import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";

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
                  <span className="text-xs font-medium leading-tight">
                    {model.modelName}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests.map((test) => (
              <TableRow key={test._id}>
                <TableCell className="sticky left-0 z-10 bg-background font-medium">
                  {test.name}
                </TableCell>
                {models.map((model) => {
                  const cell = getResult(grid, test._id, model._id);
                  return (
                    <TableCell key={model._id} className="text-center">
                      <span className="text-lg">
                        {cell?.isCorrect ? "\u2705" : "\u274C"}
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
