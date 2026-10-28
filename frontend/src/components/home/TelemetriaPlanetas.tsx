"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ArrowUpRight, Eye, Radio } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { CoordinateBadge } from "@/components/astronomy/CoordinateBadge";
import { getAzimuthDirection } from "@/lib/utils/astronomy-calc";

const PLANET_METADATA: Record<string, { magnitude: string; melhorHorario: string; descricao: string; cor: string }> = {
  "Mercúrio": { magnitude: "-0.4", melhorHorario: "Crepúsculo vespertino", descricao: "Visível a baixa altitude a oeste logo após o pôr do Sol.", cor: "#94A3B8" },
  "Vênus": { magnitude: "-4.2", melhorHorario: "Anoitecer", descricao: "Aparece com brilho soberano a oeste, exibindo fase crescente ao telescópio.", cor: "#FDE68A" },
  "Marte": { magnitude: "+0.8", melhorHorario: "A partir das 22h30", descricao: "Coloração ocre característica, cruzando o meridiano local na madrugada.", cor: "#F87171" },
  "Júpiter": { magnitude: "-2.5", melhorHorario: "Noite inteira", descricao: "O gigante do sistema solar com bandas atmosféricas e satélites em trânsito.", cor: "#FCD34D" },
  "Saturno": { magnitude: "+0.7", melhorHorario: "Até 00h30", descricao: "Sistema anelar inclinado em perspectiva privilegiada para os trópicos.", cor: "#E2E8F0" },
};

export function TelemetriaPlanetas() {
  const { data, isLoading } = useSkyToday();
  const planetas = data?.planetas_visiveis_agora || [];

  return (
    <section className="py-24 sm:py-32 relative border-t border-space-border/40">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan flex items-center gap-2">
              <Radio className="h-3.5 w-3.5" />
              Telemetria Ativa • Fase 03: Geometria Planetária
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              Planetas em Trânsito sobre Fortaleza
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Vetor aparente de azimute e altitude computados pelo Skyfield offline. Posicione sua montagem equatorial ou binóculo com rigor métrico.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-space-text-muted">
            <span className="flex h-2 w-2 rounded-full bg-aurora-green animate-pulse" />
            <span>Alvos Acima do Horizonte Local</span>
          </div>
        </div>

        {/* Lista Horizontal Estilo Linear / SpaceX Systems */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-space-surface-2/60 animate-pulse" />
            ))}
          </div>
        ) : planetas.length > 0 ? (
          <div className="space-y-4">
            {planetas.map((planeta, idx) => {
              const meta = PLANET_METADATA[planeta.nome] || {
                magnitude: "+1.0",
                melhorHorario: "Noite",
                descricao: "Corpo celeste acima da linha do horizonte.",
                cor: "#38BDF8",
              };
              const direcao = getAzimuthDirection(planeta.azimute_graus);

              return (
                <motion.div
                  key={planeta.nome}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ x: 4 }}
                  className="cosmic-glass rounded-2xl p-6 border border-white/10 hover:border-nebula-cyan/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-cosmic-sm hover:shadow-glow-cyan"
                >
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div
                      className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg border border-white/10 shrink-0"
                      style={{
                        backgroundColor: `${meta.cor}15`,
                        color: meta.cor,
                        boxShadow: `0 0 20px ${meta.cor}25`,
                      }}
                    >
                      <Globe className="h-6 w-6" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-xl font-bold text-lunar-silver">
                          {planeta.nome}
                        </h3>
                        <Badge variant="visible" className="text-[10px] px-2 py-0">
                          Visível Agora
                        </Badge>
                      </div>
                      <span className="text-xs text-space-text-muted font-mono">
                        Magnitude Visual: {meta.magnitude}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 max-w-xl text-xs sm:text-sm text-space-text-muted leading-relaxed">
                    {meta.descricao}
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:justify-end">
                    <div className="space-y-1 text-left sm:text-right">
                      <span className="text-[11px] font-mono text-space-text-muted block">
                        Ponto Cardeal
                      </span>
                      <span className="font-mono text-sm font-semibold text-nebula-cyan">
                        {direcao}
                      </span>
                    </div>

                    <CoordinateBadge
                      altitude={planeta.altitude_graus}
                      azimute={planeta.azimute_graus}
                      className="px-3.5 py-1.5 text-xs font-mono"
                    />

                    <Link href="/ceu-hoje">
                      <button
                        title="Ver radar da abóboda celeste"
                        className="rounded-lg p-2.5 bg-space-surface-2 border border-space-border text-space-text-muted hover:text-nebula-cyan hover:border-nebula-cyan/30 transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="cosmic-glass rounded-2xl p-12 text-center border border-space-border/60">
            <p className="text-space-text-muted text-sm max-w-md mx-auto">
              Nenhum planeta do sistema solar encontra-se acima do horizonte de Fortaleza neste exato instante.
            </p>
            <Link href="/ceu-hoje" className="inline-block mt-4">
              <span className="text-xs font-semibold text-nebula-cyan hover:underline">
                Acompanhar horários de ascensão na abóboda celeste →
              </span>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
