"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, Eye, Sparkles, Clock, CheckCircle2, ChevronRight, Moon, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { calcularIluminacaoLunar } from "@/lib/utils/astronomy";

/**
 * 🎓 COCKPIT PRINCIPAL DA HOME (HeroStatusCockpit)
 * 
 * Filosofia de Produto:
 * Este componente foi desenhado para resolver a pergunta número 1 de qualquer visitante em menos de 5 segundos:
 * "Vale a pena olhar para o céu de Fortaleza hoje à noite?"
 * 
 * Em vez de sobrecarregar o usuário leigo com jargões astronômicos complexos (azimute, declinação, ascensão reta),
 * o componente traduz dados brutos da FastAPI em métricas humanas:
 * 1. Resposta direta ("Sim, vale a pena").
 * 2. Quantos planetas ele consegue ver a olho nu.
 * 3. A fase da Lua e quanto ela ilumina o céu.
 * 4. A melhor janela de horário para observar.
 */
export function HeroStatusCockpit() {
  // Hook que busca dados em tempo real da FastAPI (ou usa fallback seguro se a API estiver offline)
  const { data, isLoading } = useSkyToday();

  // Tratamento de valores padrão caso a requisição ainda esteja carregando
  const planetasCount = data?.planetas_visiveis_agora?.length ?? 3;
  const faseNome = data?.fase_lua_nome || "Crescente";
  const ilumPercentual = data?.lua?.iluminacao_percentual ?? calcularIluminacaoLunar(data?.fase_lua_graus ?? 115);
  // De dia (RN001) a API não lista planetas e explica quando eles aparecem (MSG020)
  const ehDia = data?.periodo === "dia";

  return (
    <section className="relative overflow-hidden border-b border-white/[0.08] pt-6 sm:pt-10 pb-12 sm:pb-16 bg-space-background">
      {/* Luz ambiente cósmica focada */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-nebula-cyan/10 blur-[110px] rounded-full" />
      </div>

      <Container size="default">
        {/* Status Chip Vivo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 pb-4 border-b border-white/[0.06] text-xs font-mono">
          <div className="inline-flex items-center gap-2 text-aurora-green">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aurora-green" />
            </span>
            <span className="font-semibold uppercase tracking-wider text-lunar-silver">
              Céu em Fortaleza Agora:
            </span>
            <span className="text-aurora-green font-medium">
              {ehDia ? "Os planetas aparecem depois do pôr do Sol" : "Condições Favoráveis para Observação"}
            </span>
          </div>

          <div className="text-space-text-muted flex items-center gap-2">
            <span>Latitude 3.77° S</span>
            <span>•</span>
            <span className="text-lunar-silver">Atualizado em tempo real</span>
          </div>
        </div>

        {/* Resposta Principal aos 5 Segundos */}
        <div className="max-w-3xl mb-8 sm:mb-10 space-y-4">
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-space-text leading-[1.08] text-balance">
            {ehDia ? "O céu desta noite começa depois do pôr do Sol." : "Vale a pena olhar para o céu esta noite."}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-space-text-muted leading-relaxed max-w-2xl text-balance">
            {isLoading
              ? "Calculando os astros visíveis no horizonte cearense..."
              : ehDia && data?.mensagem
                ? `${data.mensagem} A Lua está em fase ${faseNome} (${ilumPercentual}% iluminada).`
                : `Temos ${planetasCount} planetas visíveis a olho nu e a Lua em fase ${faseNome} (${ilumPercentual}% iluminada). A melhor janela para observar é das 19h30 às 22h00.`}
          </p>
        </div>

        {/* 3 Métricas Humanas Imediatas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="rounded-2xl p-4 sm:p-5 bg-space-surface-1 border border-space-border/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-space-text-muted">
              <span>VISIBILIDADE A OLHO NU</span>
              <Eye className="h-4 w-4 text-nebula-cyan" />
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-space-text">
              Alta e Nítida
            </p>
            <p className="text-xs text-space-text-muted">
              Planetas brilhantes fáceis de identificar mesmo com luz urbana.
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-space-surface-1 border border-space-border/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-space-text-muted">
              <span>FASE DA LUA</span>
              <Moon className="h-4 w-4 text-stellar-amber" />
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-stellar-amber">
              {faseNome} ({ilumPercentual}%)
            </p>
            <p className="text-xs text-space-text-muted">
              Iluminação ideal para ver crateras na linha da sombra.
            </p>
          </div>

          <div className="rounded-2xl p-4 sm:p-5 bg-space-surface-1 border border-space-border/60 space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-space-text-muted">
              <span>MELHOR HORÁRIO</span>
              <Clock className="h-4 w-4 text-aurora-green" />
            </div>
            <p className="font-display text-xl sm:text-2xl font-bold text-space-text">
              19h30 às 22h00
            </p>
            <p className="text-xs text-space-text-muted">
              Maior altitude dos astros principais acima dos prédios.
            </p>
          </div>
        </div>

        {/* Chamadas de Ação com Hierarquia Rigorosa (1 Primária, 1 Secundária) */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href="#o-que-observar"
            className="w-full sm:w-auto h-11 px-6 rounded-xl bg-nebula-cyan text-space-background font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-nebula-cyan/90 transition-all active:scale-[0.99] shadow-sm"
          >
            <Eye className="h-4 w-4" />
            <span>Ver os 3 Melhores Astros de Hoje</span>
          </a>

          <a
            href="#onde-olhar"
            className="w-full sm:w-auto h-11 px-5 rounded-xl bg-space-surface-2 hover:bg-space-surface-2/80 text-space-text-muted hover:text-white border border-white/[0.08] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Compass className="h-4 w-4 text-nebula-cyan" />
            <span>Guia Direcional (Para onde olhar)</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
