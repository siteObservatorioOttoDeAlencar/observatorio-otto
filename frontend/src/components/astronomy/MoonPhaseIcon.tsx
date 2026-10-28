import * as React from "react";
import { FaseLuaNome } from "@/types/astronomy";
import { Moon, MoonStar } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface MoonPhaseIconProps {
  fase: FaseLuaNome;
  className?: string;
}

export function MoonPhaseIcon({ fase, className }: MoonPhaseIconProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 text-lunar-silver", className)}>
      {fase === "Cheia" ? (
        <MoonStar className="h-5 w-5 text-stellar-amber cosmic-glow" />
      ) : (
        <Moon className="h-5 w-5 text-lunar-silver" />
      )}
      <span className="text-sm font-medium">{fase}</span>
    </div>
  );
}
