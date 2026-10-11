import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { formatCoordinates } from "@/lib/utils/formatters";

interface CoordinateBadgeProps {
  altitude: number;
  azimute: number;
  className?: string;
}

export function CoordinateBadge({ altitude, azimute, className }: CoordinateBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded bg-space-surface-2 px-2.5 py-1 font-mono text-xs text-lunar-silver border border-space-border",
        className
      )}
    >
      <span>
        <span className="text-space-text-muted">Alt:</span> {formatCoordinates(altitude, "altitude")}
      </span>
      <span className="text-space-border">|</span>
      <span>
        <span className="text-space-text-muted">Az:</span> {formatCoordinates(azimute, "azimute")}
      </span>
    </div>
  );
}
