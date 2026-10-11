import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-space-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-nebula-cyan text-space-background font-semibold hover:bg-nebula-cyan/90 shadow-cosmic-sm hover:shadow-glow-cyan",
        glass:
          "cosmic-glass text-lunar-silver hover:border-nebula-cyan/40 hover:text-white shadow-cosmic-sm",
        outline:
          "border border-space-border bg-transparent text-lunar-silver hover:bg-space-surface-2 hover:border-nebula-cyan/30",
        ghost:
          "text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-2/60",
        secondary:
          "bg-space-surface-2 text-lunar-silver hover:bg-space-surface-2/80 border border-space-border/60",
        danger:
          "bg-crimson-deep text-white hover:bg-crimson-deep/90 shadow-cosmic-sm",
        amber:
          "bg-stellar-amber text-space-background font-semibold hover:bg-stellar-amber/90 shadow-glow-amber",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Processando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
