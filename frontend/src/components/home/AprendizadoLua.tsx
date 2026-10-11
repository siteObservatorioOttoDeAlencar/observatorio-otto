"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Info, Moon, Compass, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";

export function AprendizadoLua() {
  const { data, isLoading } = useSkyToday();

  const faseNome = data?.fase_lua_nome || "Crescente";
  const faseGraus = data?.fase_lua_graus ?? 115.4;
  const ilumPercentual = Math.round((1 - Math.cos((faseGraus * Math.PI) / 180)) * 50);

  return (
    <section className="py-14 sm:py-20 md:py-24 relative overflow-hidden border-t border-space-border/40">
      <Container size="default">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cosmic-glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/10 shadow-cosmic relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coluna do Disco Lunar - Escala e Detalhe de Documentário */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              <div className="relative w-52 h-52 sm:w-72 sm:h-72 rounded-full flex items-center justify-center">
                {/* Trajetória orbital suave */}
                <div className="absolute inset-0 rounded-full border border-space-border/50 animate-[spin_80s_linear_infinite]" />
                <div className="absolute -inset-3 rounded-full border border-dashed border-nebula-cyan/20 animate-[spin_120s_linear_infinite_reverse]" />

                {/* Fotografia Lunar de Alta Densidade */}
                <div
                  className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-cover bg-center shadow-[inset_-25px_-20px_50px_rgba(0,0,0,0.92)] border border-white/10"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1200&auto=format&fit=crop')`,
                  }}
                />

                {/* Tag de Telemetria de Iluminação */}
                <div className="absolute bottom-2 rounded-full cosmic-glass px-3 py-0.5 font-mono text-xs border border-white/20 text-lunar-silver shadow backdrop-blur-md">
                  {ilumPercentual}% iluminada
                </div>
              </div>
            </div>

            {/* Coluna Informativa e Narrativa 3: Aprendizado */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan">
                  Fase 03: Aprendizado • Geometria Orbital
                </span>
                <span className="font-mono text-xs text-space-text-muted">
                  Ângulo Heliocêntrico: {faseGraus.toFixed(1)}°
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-lunar-silver tracking-tight">
                  A Lua em Fortaleza:{" "}
                  <span className="bg-gradient-to-r from-nebula-cyan via-lunar-silver to-stellar-amber bg-clip-text text-transparent">
                    {isLoading ? "Sincronizando..." : faseNome}
                  </span>
                </h3>
                <p className="text-space-text-muted text-sm sm:text-base leading-relaxed text-balance">
                  A iluminação lunar altera drasticamente o céu observacional. Em noites de lua crescente ou minguante inicial, as sombras projetadas sobre as crateras e vales da borda (o terminador lunar) revelam a geografia cósmica em relevo tridimensional impressionante.
                </p>
              </div>

              {/* Painel de Métricas estilo Cockpit Apple/SpaceX */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-space-border/60">
                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50">
                  <span className="font-mono text-[11px] text-space-text-muted block">Disco Iluminado</span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-nebula-cyan">
                    {ilumPercentual}%
                  </span>
                </div>

                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50">
                  <span className="font-mono text-[11px] text-space-text-muted block">Qualidade Céu Profundo</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-aurora-green flex items-center gap-1.5">
                    {ilumPercentual > 75 ? "Luminosidade Alta" : "Contraste Ótimo"}
                  </span>
                </div>

                <div className="cosmic-glass rounded-xl p-4 space-y-1 border border-space-border/50 col-span-2 sm:col-span-1">
                  <span className="font-mono text-[11px] text-space-text-muted block">Distância Média</span>
                  <span className="font-mono text-xl sm:text-2xl font-bold text-lunar-silver">
                    384.400 <span className="text-xs font-normal text-space-text-muted">km</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-space-text-muted font-mono pt-1">
                <Info className="h-4 w-4 text-nebula-cyan shrink-0" />
                <span>
                  Efemérides computadas em tempo real com base no modelo astronômico local da Universidade.
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
