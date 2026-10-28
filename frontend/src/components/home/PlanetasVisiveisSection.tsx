"use client";

import * as React from "react";
import Link from "next/link";
import { Globe, ArrowUpRight, Compass, ShieldAlert, Sparkles, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { CoordinateBadge } from "@/components/astronomy/CoordinateBadge";
import { getAzimuthDirection } from "@/lib/utils/astronomy-calc";

// Dados descritivos estáticos para complementar as telemetrias dos planetas
const PLANET_METADATA: Record<string, { magnitude: string; melhorHorario: string; descricao: string; cor: string }> = {
  "Mercúrio": {
    magnitude: "-0.4",
    melhorHorario: "Crepúsculo vespertino",
    descricao: "Baixo sobre o horizonte oeste logo após o pôr do Sol.",
    cor: "#94A3B8",
  },
  "Vênus": {
    magnitude: "-4.2",
    melhorHorario: "Início da noite",
    descricao: "O astro mais brilhante após a Lua, exibindo fases com telescópio.",
    cor: "#FDE68A",
  },
  "Marte": {
    magnitude: "+0.8",
    melhorHorario: "A partir das 22:30",
    descricao: "Tom avermelhado característico com rotação e calotas polares visíveis.",
    cor: "#F87171",
  },
  "Júpiter": {
    magnitude: "-2.5",
    melhorHorario: "Noite inteira",
    descricao: "Bandas equatoriais nítidas e quatro luas galileanas em trânsito constante.",
    cor: "#FCD34D",
  },
  "Saturno": {
    magnitude: "+0.7",
    melhorHorario: "Até 00:30",
    descricao: "Esplêndido sistema de anéis com inclinação favorável e satélite Titã.",
    cor: "#E2E8F0",
  },
};

export function PlanetasVisiveisSection() {
  const { data, isLoading } = useSkyToday();

  // Planetas visíveis vindos da FastAPI ou fallback instrutivo
  const planetas = data?.planetas_visiveis_agora || [];

  return (
    <section className="py-20 sm:py-28 relative border-t border-space-border/50">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-nebula-cyan text-xs font-mono uppercase tracking-widest">
              <Eye className="h-3.5 w-3.5" />
              <span>Telemetria de Órbitas Planetárias</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              Planetas Visíveis Esta Noite
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Posições aparentes calculadas pelo modelo do Observatório Otto de Alencar em tempo real. Identifique o azimute e altitude ideais para apontar seus instrumentos.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-space-text-muted">
            <span className="flex h-2 w-2 rounded-full bg-aurora-green" />
            <span>Atualizado a cada 5 min</span>
          </div>
        </div>

        {/* Lista de Cards Horizontais estilo SpaceX Cockpit */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-space-surface-2 animate-pulse" />
            ))}
          </div>
        ) : planetas.length > 0 ? (
          <div className="space-y-4">
            {planetas.map((planeta) => {
              const meta = PLANET_METADATA[planeta.nome] || {
                magnitude: "+1.0",
                melhorHorario: "Noite",
                descricao: "Corpo celeste detectado acima do horizonte local.",
                cor: "#38BDF8",
              };
              const direcao = getAzimuthDirection(planeta.azimute_graus);

              return (
                <div
                  key={planeta.nome}
                  className="cosmic-glass-interactive rounded-2xl p-5 sm:p-6 border border-space-border/70 hover:border-nebula-cyan/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Identificação do Planeta */}
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
                          No Céu
                        </Badge>
                      </div>
                      <span className="text-xs text-space-text-muted font-mono">
                        Magnitude: {meta.magnitude}
                      </span>
                    </div>
                  </div>

                  {/* Descrição e Condições */}
                  <div className="flex-1 max-w-xl text-xs sm:text-sm text-space-text-muted leading-relaxed">
                    {meta.descricao}
                  </div>

                  {/* Coordenadas e Posição (Alt / Az / Direção) */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:justify-end">
                    <div className="space-y-1 text-left sm:text-right">
                      <span className="text-[11px] font-mono text-space-text-muted block">
                        Direção no Horizonte
                      </span>
                      <span className="font-mono text-sm font-semibold text-nebula-cyan">
                        {direcao}
                      </span>
                    </div>

                    <CoordinateBadge
                      altitude={planeta.altitude_graus}
                      azimute={planeta.azimute_graus}
                      className="px-3 py-1.5 text-xs"
                    />

                    <Link href="/ceu-hoje">
                      <button
                        title="Ver dados celestes detalhados"
                        className="rounded-lg p-2.5 bg-space-surface-2 border border-space-border text-space-text-muted hover:text-nebula-cyan hover:border-nebula-cyan/30 transition-colors"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="cosmic-glass rounded-2xl p-10 text-center border border-space-border/60">
            <p className="text-space-text-muted text-sm">
              Neste momento, os planetas do sistema solar monitorados estão abaixo do horizonte para Fortaleza. Eles reaparecerão no próximo período de trânsito planetário.
            </p>
            <Link href="/ceu-hoje" className="inline-block mt-4">
              <span className="text-xs font-semibold text-nebula-cyan hover:underline">
                Consultar previsões de trânsito completo →
              </span>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
