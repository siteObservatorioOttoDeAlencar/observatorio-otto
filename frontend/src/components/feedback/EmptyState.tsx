import * as React from "react";
import { Telescope } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center cosmic-glass rounded-2xl border border-space-border/60">
      <div className="rounded-full bg-space-surface-2 p-4 text-nebula-cyan mb-4">
        <Telescope className="h-8 w-8" />
      </div>
      <h3 className="font-display text-lg font-semibold text-lunar-silver">{title}</h3>
      <p className="mt-2 text-sm text-space-text-muted max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
