import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
  "border-4 border-black text-sm font-bold uppercase tracking-wider " +
  "transition-all disabled:pointer-events-none " +
  "disabled:opacity-50 [&_svg]:pointer-events-none " +
  "[&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 " +
  "outline-none focus-visible:border-ring focus-visible:ring-ring/50 " +
  "focus-visible:ring-[3px] aria-invalid:ring-destructive/20 " +
  "dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive " +
  "dark:border-foreground",
  {
    variants: {
      variant: {
        default: `
          bg-primary text-primary-foreground
          shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#f5f5f0]
          hover:translate-x-1 hover:translate-y-1 hover:shadow-none
        `,
        destructive:
          "bg-neon-pink text-white " +
          "shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#f5f5f0] " +
          "hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        outline:
          "border-4 bg-background shadow-[4px_4px_0px_#000] " +
          "dark:shadow-[4px_4px_0px_#f5f5f0] " +
          "hover:translate-x-1 hover:translate-y-1 hover:shadow-none",
        secondary:
          `
            bg-secondary text-secondary-foreground
            shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_#f5f5f0]
            hover:translate-x-1 hover:translate-y-1 hover:shadow-none
          `,
        ghost:
          `
            border-transparent shadow-none
            hover:bg-muted
            dark:hover:bg-muted
          `,
        link: `
          border-transparent shadow-none
          text-primary underline-offset-4
          hover:underline
        `,
      },
      size: {
        default: `
          h-9 px-4 py-2
          has-[>svg]:px-3
        `,
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 " +
          "[&_svg:not([class*='size-'])]:size-3",
        sm: `
          h-8 gap-1.5 px-3
          has-[>svg]:px-2.5
        `,
        lg: `
          h-10 px-6
          has-[>svg]:px-4
        `,
        icon: "size-9",
        "icon-xs": `
          size-6
          [&_svg:not([class*='size-'])]:size-3
        `,
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
