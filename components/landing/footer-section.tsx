import { Separator } from "@/components/ui/separator";

export function FooterSection() {
  return (
    <footer className="py-8">
      <Separator className="mb-8" />
      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          ReAIity Checker — No hype. No marketing. Just honest data.
        </p>
        <p>Open source project</p>
      </div>
    </footer>
  );
}
