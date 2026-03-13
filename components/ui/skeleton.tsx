import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse border-2 border-black bg-muted dark:border-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
