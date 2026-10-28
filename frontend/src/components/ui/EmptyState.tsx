import * as React from "react";
import { Telescope, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Telescope,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <Card
      variant="glass"
      className={cn("flex flex-col items-center justify-center p-12 text-center", className)}
      {...props}
    >
      <div className="rounded-2xl bg-space-surface-2 p-4 text-nebula-cyan mb-4 border border-space-border/60 shadow-cosmic-sm">
        <Icon className="h-8 w-8 cosmic-glow" />
      </div>
      <h3 className="font-display text-lg font-semibold text-lunar-silver">{title}</h3>
      <p className="mt-2 text-sm text-space-text-muted max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
