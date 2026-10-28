"use client";

import * as React from "react";
import { Moon, Sparkles, Compass, Calendar, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";

export function FaseLuaSection() {
  const { data, isLoading } = useSkyToday();

  // Dados calculados pela FastAPI ou fallbacks estáticos elegantes
  const faseNome = data?.fase_lua_nome || "Crescente";
  const faseGraus = data?.fase_lua_graus ?? 115.4;
  
  // Percentual aproximado de iluminação calculado a partir do ângulo de fase
  const ilumPercentual = Math.round((1 - Math.cos((faseGraus * Math.PI) / 180)) * 50);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Glow de fundo lunar difuso */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-nebula-cyan/5 via-lunar-silver/10 to-stellar-amber/5 blur-[120px] pointer-events-none -z-10" />

      <Container size="default">
        <div className="cosmic-glass rounded-3xl p-8 sm:p-12 lg:p-16 border border-space-border/80 shadow-cosmic relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Coluna Visual: O Disco Lunar em Alta Definição */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 rounded-full flex items-center justify-center">
                {/* Anéis orbitais concêntricos */}
                <div className="absolute inset-0 rounded-full border border-space-border/50 animate-[spin_60s_linear_infinite]" />
                <div className="absolute -inset-4 rounded-full border border-dashed border-nebula-cyan/20 animate-[spin_90s_linear_infinite_reverse]" />
                
                {/* Glow sutil emanado da lua */}
                <div className="absolute inset-2 rounded-full bg-lunar-silver/10 blur-xl" />

                {/* Ilustração Fotográfica da Lua */}
                <div
                  className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-cover bg-center shadow-[inset_-25px_-20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(226,232,240,0.25)] border border-lunar-silver/20"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1200&auto=format&fit=crop')`,
                  }}
                />

                {/* Indicador de iluminação fixo no disco */}
                <div className="absolute bottom-2 rounded-full cosmic-glass px-3 py-1 font-mono text-xs border border-white/20 text-lunar-silver shadow-lg">
                  {ilumPercentual}% iluminada
                </div>
              </div>
            </div>

            {/* Coluna Informativa: Ciência e Painel de Dados */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="cyan" className="font-mono text-xs">
                  Satélite Natural da Terra
                </Badge>
                <span className="font-mono text-xs text-space-text-muted">
                  Ângulo Elíptico: {faseGraus.toFixed(1)}°
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-lunar-silver tracking-tight">
                  Fase Lunar:{" "}
                  <span className="text-gradient-cyan">
                    {isLoading ? "Calculando..." : faseNome}
                  </span>
                </h3>
                <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
                  A fase lunar atual determina o contraste do céu noturno em Fortaleza. Em fases de baixa iluminação, objetos de céu profundo como nebulosas e aglomerados ganham nitidez máxima; durante a fase cheia, crateras e mares lunares revelam seu relevo espetacular.
                </p>
              </div>

              {/* Grid Técnico de Parâmetros da Lua estilo SpaceX */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-space-border/60">
                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50">
                  <span className="font-mono text-[11px] text-space-text-muted block">Iluminação</span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-nebula-cyan">
                    {ilumPercentual}%
                  </span>
                </div>

                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50">
                  <span className="font-mono text-[11px] text-space-text-muted block">Qualidade de Céu Profundo</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-aurora-green flex items-center gap-1">
                    {ilumPercentual > 75 ? "Brilho Alto" : "Excelente Contraste"}
                  </span>
                </div>

                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50 col-span-2 sm:col-span-1">
                  <span className="font-mono text-[11px] text-space-text-muted block">Distância Média</span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-lunar-silver">
                    384.400 <span className="text-xs font-normal text-space-text-muted">km</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-space-text-muted font-mono pt-2">
                <Info className="h-4 w-4 text-nebula-cyan shrink-0" />
                <span>
                  Dados computados em tempo real pelo algoritmo de efemérides DE421 do Observatório Otto de Alencar.
                </span>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
