import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const skeletonVariants = cva("animate-pulse bg-space-surface-2", {
  variants: {
    variant: {
      default: "rounded-md",
      circle: "rounded-full",
      card: "rounded-xl border border-space-border/40",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      role="status"
      aria-label="Carregando dados..."
      {...props}
    />
  );
}
