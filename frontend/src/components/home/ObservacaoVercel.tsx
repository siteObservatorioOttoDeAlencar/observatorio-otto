"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, Sparkles, Clock, Globe } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { CoordinateBadge } from "@/components/astronomy/CoordinateBadge";

export function ObservacaoVercel() {
  const { data, isLoading } = useSkyToday();
  const planetas = data?.planetas_visiveis_agora || [];

  return (
    <section className="py-14 sm:py-20 md:py-24 relative border-b border-white/[0.08]">
      <Container size="default">
        {/* Cabeçalho Minimalista com Grade Vercel */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-nebula-cyan uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-nebula-cyan" />
              <span>RADAR DE EFEMÉRIDES • EDIÇÃO NOTURNA</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              O Que o Céu Noturno Revela Hoje
            </h2>
            <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
              Grade de alta densidade informativa computada em tempo real para os céus de Fortaleza. Alvos celestes organizados por ascensão, altitude e magnitude.
            </p>
          </div>

          <Link
            href="/ceu-hoje"
            className="inline-flex items-center gap-2 text-xs font-mono font-medium text-lunar-silver hover:text-nebula-cyan transition-colors group shrink-0"
          >
            <span>ABRIR MAPA COMPLETO DA ABÓBODA</span>
            <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid de Observação estilo Vercel (Grid de Linhas Pretas, Bordas Sutis & Gradientes) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/[0.08] rounded-2xl overflow-hidden border border-white/[0.08]">
          {/* Card Principal 1: Destaque de Capa de Observação (7 colunas) */}
          <div className="md:col-span-7 bg-space-surface-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between relative group hover:bg-space-surface-2/60 transition-colors duration-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="visible">ALVO PRINCIPAL DESTA NOITE</Badge>
                <span className="font-mono text-xs text-space-text-muted">Touro • Mag -2.5</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-nebula-cyan transition-colors">
                Júpiter e a Dança dos Satélites Galileanos
              </h3>
              <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed max-w-xl">
                O maior planeta do sistema solar está em posição favorável nos trópicos. Binóculos com ampliação de 10x ou mais já revelam a separação angular de Ío, Europa, Ganimedes e Calisto ao longo do plano equatorial.
              </p>
            </div>

            <div className="pt-5 mt-5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <span className="text-lunar-silver flex items-center gap-2">
                <Clock className="h-4 w-4 text-stellar-amber" />
                Janela ideal: 20h30 — 02h00
              </span>
              <span className="text-nebula-cyan flex items-center gap-1 group-hover:underline">
                Visualizar efeméride no radar <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Nebulosa de Órion (5 colunas) */}
          <div className="md:col-span-5 bg-space-surface-1 p-5 sm:p-7 md:p-8 flex flex-col justify-between relative group hover:bg-space-surface-2/60 transition-colors duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">CÉU PROFUNDO</Badge>
                <span className="font-mono text-xs text-space-text-muted">Órion • M42</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-nebula-cyan transition-colors">
                Grande Nebulosa de Órion
              </h3>
              <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                Nuvem interestelar ativa visível logo abaixo do cinturão das Três Marias. Excelente teste de contraste e transparência atmosférica para Fortaleza.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <span className="text-lunar-silver">Binóculo / Telescópio</span>
              <span className="text-nebula-cyan">1.344 anos-luz</span>
            </div>
          </div>

          {/* Linha Inferior do Bento Grid: Planetas em Trânsito (3 colunas de 4) */}
          {isLoading ? (
            <div className="md:col-span-12 bg-space-surface-1 p-8 text-center text-xs font-mono text-space-text-muted animate-pulse">
              Consultando vetor do Skyfield...
            </div>
          ) : planetas.length > 0 ? (
            planetas.slice(0, 3).map((planeta) => (
              <div
                key={planeta.nome}
                className="md:col-span-4 bg-space-surface-1 p-4 sm:p-6 md:p-7 flex flex-col justify-between group hover:bg-space-surface-2/60 transition-colors duration-200"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-nebula-cyan uppercase tracking-wider">
                      PLANETA EM TRÂNSITO
                    </span>
                    <Badge variant="visible" className="text-[10px] py-0">No Céu</Badge>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-nebula-cyan transition-colors">
                    {planeta.nome}
                  </h4>
                  <CoordinateBadge
                    altitude={planeta.altitude_graus}
                    azimute={planeta.azimute_graus}
                    className="text-[11px]"
                  />
                </div>

                <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-space-text-muted">
                  <span>Horizonte Ceará</span>
                  <Link href="/ceu-hoje" className="text-nebula-cyan flex items-center gap-1 hover:underline min-h-[36px]">
                    Rastrear <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-12 bg-space-surface-1 p-8 text-center text-xs font-mono text-space-text-muted">
              Planetas do sistema solar repousam abaixo do horizonte neste instante. Reaparecem nas próximas horas.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
