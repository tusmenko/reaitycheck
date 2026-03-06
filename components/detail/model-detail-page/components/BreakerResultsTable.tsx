import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCategory } from "@/lib/model-detail-utils";

interface TestRun {
  isCorrect: boolean;
  rawResponse: string | null;
}

interface BreakdownEntry {
  test: {
    _id: string;
    slug: string;
    name: string;
    category: string;
  };
  latestRun: TestRun | null;
  successRate: number;
  totalRuns: number;
}

interface BreakerResultsTableProps {
  breakdown: BreakdownEntry[];
}

export const BreakerResultsTable = ({ breakdown }: BreakerResultsTableProps) => {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold">Breaker Results</h2>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Latest Result</TableHead>
              <TableHead className="text-center">Success Rate</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breakdown.map((entry) => {
              const passed = entry.latestRun?.isCorrect ?? false;
              const ratePct =
                entry.totalRuns > 0 ? Math.round(entry.successRate * 100) : 0;
              return (
                <TableRow key={entry.test._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/challenges/${entry.test.slug}`}
                      className="
                        text-primary underline-offset-4
                        hover:underline
                      "
                    >
                      {entry.test.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatCategory(entry.test.category)}</TableCell>
                  <TableCell className="text-center">
                    {entry.latestRun ? (
                      passed ? (
                        <Check className="
                          mx-auto size-5 text-green-600
                          dark:text-green-500
                        " />
                      ) : (
                        <X className="mx-auto size-5 text-destructive" />
                      )
                    ) : (
                      <span className="text-muted-foreground">–</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{ratePct}%</TableCell>
                  <TableCell>
                    {entry.latestRun?.rawResponse != null ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="
                          max-h-[80vh] max-w-2xl overflow-y-auto
                        ">
                          <DialogHeader>
                            <DialogTitle>Raw response</DialogTitle>
                          </DialogHeader>
                          <pre className="
                            rounded-sm bg-muted p-4 text-sm wrap-break-word
                            whitespace-pre-wrap
                          ">
                            {entry.latestRun.rawResponse}
                          </pre>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      "–"
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
