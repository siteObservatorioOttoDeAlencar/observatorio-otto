import * as React from "react";
import { PlanetaVisivel } from "@/types/astronomy";
import { Badge } from "@/components/ui/Badge";
import { CoordinateBadge } from "@/components/astronomy/CoordinateBadge";
import { Globe2 } from "lucide-react";

interface CelestialCardProps {
  planeta: PlanetaVisivel;
}

export function CelestialCard({ planeta }: CelestialCardProps) {
  return (
    <div className="cosmic-glass rounded-xl p-5 transition-all hover:border-nebula-cyan/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-nebula-cyan/10 p-2 text-nebula-cyan">
            <Globe2 className="h-5 w-5" />
          </div>
          <h3 className="font-display text-lg font-semibold text-lunar-silver">
            {planeta.nome}
          </h3>
        </div>
        <Badge variant="visible">Visível Agora</Badge>
      </div>

      <div className="mt-3">
        <CoordinateBadge
          altitude={planeta.altitude_graus}
          azimute={planeta.azimute_graus}
        />
      </div>
    </div>
  );
}
