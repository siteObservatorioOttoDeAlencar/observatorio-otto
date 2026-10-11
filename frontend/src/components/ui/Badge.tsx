import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-nebula-cyan",
  {
    variants: {
      variant: {
        visible:
          "bg-aurora-green/15 text-aurora-green border border-aurora-green/30 shadow-[0_0_8px_rgba(16,185,129,0.2)]",
        belowHorizon:
          "bg-space-surface-2 text-space-text-muted border border-space-border",
        amber:
          "bg-stellar-amber/15 text-stellar-amber border border-stellar-amber/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
        cyan:
          "bg-nebula-cyan/15 text-nebula-cyan border border-nebula-cyan/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]",
        danger:
          "bg-crimson-deep/15 text-crimson-deep border border-crimson-deep/30",
        outline:
          "text-lunar-silver border border-space-border bg-transparent",
        subtle:
          "bg-space-surface-2 text-lunar-silver border border-space-border/60",
      },
    },
    defaultVariants: {
      variant: "cyan",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
