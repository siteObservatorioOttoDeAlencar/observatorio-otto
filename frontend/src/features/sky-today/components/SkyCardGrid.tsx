import * as React from "react";
import { CelestialCard } from "@/components/astronomy/CelestialCard";
import { PlanetaVisivel } from "@/types/astronomy";

interface SkyCardGridProps {
  planetas: PlanetaVisivel[];
}

export function SkyCardGrid({ planetas }: SkyCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {planetas.map((planeta) => (
        <CelestialCard key={planeta.nome} planeta={planeta} />
      ))}
    </div>
  );
}
