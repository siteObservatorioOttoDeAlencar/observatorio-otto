import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const inputVariants = cva(
  "flex w-full rounded-lg border bg-space-surface-1 px-3 py-2 text-sm text-lunar-silver placeholder:text-space-text-muted transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-cyan focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-space-border hover:border-nebula-cyan/30",
        glass: "cosmic-glass border-space-border/80",
        error: "border-crimson-deep focus-visible:ring-crimson-deep text-crimson-deep",
      },
      inputSize: {
        sm: "h-8 text-xs px-2.5",
        default: "h-10 text-sm",
        lg: "h-12 text-base px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || React.useId();
    const effectiveVariant = error ? "error" : variant;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-space-text-muted">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(inputVariants({ variant: effectiveVariant, inputSize, className }))}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-crimson-deep animate-in fade-in">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-space-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
