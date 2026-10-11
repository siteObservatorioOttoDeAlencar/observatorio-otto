import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

export const textareaVariants = cva(
  "flex min-h-[96px] w-full rounded-lg border bg-space-surface-1 px-3 py-2 text-sm text-lunar-silver placeholder:text-space-text-muted transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-cyan focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-space-border hover:border-nebula-cyan/30",
        glass: "cosmic-glass border-space-border/80",
        error: "border-crimson-deep focus-visible:ring-crimson-deep",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, label, helperText, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const effectiveVariant = error ? "error" : variant;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-space-text-muted">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(textareaVariants({ variant: effectiveVariant, className }))}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-crimson-deep">
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
Textarea.displayName = "Textarea";
