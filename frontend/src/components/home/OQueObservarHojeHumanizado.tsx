"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Binary, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { formatarDataLocal } from "@/features/sky-today/components/SolELuaHoje";
import { calcularIluminacaoLunar } from "@/lib/utils/astronomy";
import type { ObservarHojeResponse, PlanetaVisivel } from "@/types/astronomy";

/**
 * OQueObservarHojeHumanizado
 *
 * PROPÓSITO:
 * Apresenta os alvos astronômicos mais fáceis e interessantes da noite atual em Fortaleza.
 *
 * ARQUITETURA DUAL (MODO SIMPLES vs. MODO TÉCNICO):
 * - Modo Simples (default): Linguagem para 95% do público (ex: "Leste, a meia altura", "Apenas seus olhos").
 * - Modo Técnico: Altitude e azimute em graus, ângulo de fase da Lua e próximas fases.
 *
 * ORIGEM DOS DADOS:
 * Consome o hook 'useSkyToday()', que por sua vez se conecta à FastAPI (Python) com fallback seguro.
 * A direção (RN003) e a altura (RN004) vêm calculadas pela API; de dia (RN001) nenhum planeta é listado
 * e a API explica quando eles aparecem.
 */

const MAX_PLANETAS = 2; // o terceiro cartão é a Lua

/** Planetas mais interessantes primeiro: o destaque da noite, depois os mais altos. */
export function escolherDestaques(planetas: PlanetaVisivel[], max = MAX_PLANETAS): PlanetaVisivel[] {
  return [...planetas]
    .sort((a, b) => Number(b.destaque_da_noite) - Number(a.destaque_da_noite) || b.altitude_graus - a.altitude_graus)
    .slice(0, max);
}

const CAIXA = "pt-3 space-y-1.5 text-xs font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04]";
const CAIXA_TECNICA =
  "pt-3 space-y-1 text-[11px] font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04] text-space-text-muted";
const CARTAO =
  "rounded-2xl p-5 sm:p-6 bg-space-surface-1/90 border border-white/[0.08] flex flex-col justify-between hover:border-nebula-cyan/40 transition-colors";

function Linha({ rotulo, valor, destaque }: { rotulo: string; valor: React.ReactNode; destaque?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-lunar-silver">
      <span className="text-space-text-muted">{rotulo}</span>
      <strong className={destaque ? "text-nebula-cyan text-right" : "text-right font-normal"}>{valor}</strong>
    </div>
  );
}

function CartaoPlaneta({ planeta, modoTecnico }: { planeta: PlanetaVisivel; modoTecnico: boolean }) {
  return (
    <div className={CARTAO}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={planeta.visivel_a_olho_nu ? "visible" : "subtle"}>
            {planeta.visivel_a_olho_nu ? "A Olho Nu" : "Precisa de Telescópio"}
            {planeta.nivel_dificuldade ? ` (${planeta.nivel_dificuldade})` : ""}
          </Badge>
          {planeta.destaque_da_noite && (
            <span className="font-mono text-xs text-stellar-amber font-semibold">Destaque da noite</span>
          )}
        </div>
        <h3 className="font-display text-xl font-bold text-white">{planeta.nome}</h3>

        {!modoTecnico ? (
          <div className={CAIXA}>
            <Linha
              rotulo="Para onde olhar:"
              valor={planeta.direcao_cardeal ?? "—"}
              destaque
            />
            <Linha rotulo="Altura no céu:" valor={planeta.altura ?? "—"} />
            {planeta.visibilidade && <Linha rotulo="Visibilidade:" valor={planeta.visibilidade} />}
          </div>
        ) : (
          <div className={CAIXA_TECNICA}>
            <div className="flex justify-between">
              <span>Altitude:</span>
              <strong className="text-lunar-silver">{planeta.altitude_graus.toFixed(1)}°</strong>
            </div>
            <div className="flex justify-between">
              <span>Azimute:</span>
              <strong className="text-lunar-silver">{planeta.azimute_graus.toFixed(1)}°</strong>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 text-xs font-mono">
        <span className="text-space-text-muted">Equipamento: {planeta.equipamento_recomendado ?? "—"}</span>
        <Link href="/ceu-hoje#radar" className="text-nebula-cyan hover:underline inline-flex items-center gap-1 shrink-0">
          Ver no Domo <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

function CartaoLua({ data, modoTecnico }: { data: ObservarHojeResponse; modoTecnico: boolean }) {
  const lua = data.lua;
  const nome = lua?.fase_nome ?? data.fase_lua_nome;
  const graus = lua?.fase_graus ?? data.fase_lua_graus;
  const iluminacao = lua?.iluminacao_percentual ?? calcularIluminacaoLunar(graus);

  return (
    <div className={CARTAO}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="cyan">A Olho Nu / Binóculo</Badge>
          <span className="font-mono text-xs text-stellar-amber font-semibold">{nome}</span>
        </div>
        <h3 className="font-display text-xl font-bold text-white">Lua</h3>
        <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
          Aponte qualquer binóculo ou telescópio para a divisa entre o lado claro e o escuro: as sombras ali revelam
          crateras e montanhas lunares em relevo.
        </p>

        {!modoTecnico ? (
          <div className={CAIXA}>
            <Linha rotulo="Fase:" valor={nome} destaque />
            <Linha rotulo="Iluminação:" valor={`${iluminacao}% iluminada`} />
            {lua && <Linha rotulo="Nasce / põe-se:" valor={`${lua.nascer} / ${lua.por}`} />}
          </div>
        ) : (
          <div className={CAIXA_TECNICA}>
            <div className="flex justify-between">
              <span>Ângulo de Fase:</span>
              <strong className="text-lunar-silver">{graus.toFixed(1)}°</strong>
            </div>
            {lua && (
              <>
                <div className="flex justify-between">
                  <span>Próxima Lua cheia:</span>
                  <strong className="text-lunar-silver">{formatarDataLocal(lua.proxima_lua_cheia)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Próxima Lua nova:</span>
                  <strong className="text-lunar-silver">{formatarDataLocal(lua.proxima_lua_nova)}</strong>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
        <span className="text-space-text-muted">Equipamento: Binóculo ajuda</span>
        <Link href="/ceu-hoje#lua" className="text-nebula-cyan hover:underline inline-flex items-center gap-1">
          Detalhes da Lua <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

export function OQueObservarHojeHumanizado() {
  const { data, isLoading } = useSkyToday();
  const [modoTecnico, setModoTecnico] = React.useState(false);

  const planetas = data?.planetas_visiveis_agora || [];
  const destaques = escolherDestaques(planetas);
  const ehDia = data?.periodo === "dia";

  return (
    <section id="o-que-observar" className="py-12 sm:py-16 md:py-20 relative border-b border-white/[0.08] scroll-mt-16">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-nebula-cyan uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Destaques da Noite em Fortaleza</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-space-text">
              O Que Vale a Pena Ver Hoje
            </h2>
            <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
              Os astros mais brilhantes e fáceis de encontrar no céu de Fortaleza agora, com orientações práticas para
              você achar cada um.
            </p>
          </div>

          {/* Toggle Modo Simples vs. Modo Técnico */}
          <div className="flex items-center gap-2 bg-space-surface-2 p-1 rounded-xl border border-space-border/60 text-xs self-start md:self-auto shrink-0">
            <button
              onClick={() => setModoTecnico(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !modoTecnico
                  ? "bg-nebula-cyan text-space-background font-semibold"
                  : "text-space-text-muted hover:text-space-text"
              }`}
            >
              👁 Modo Simples
            </button>
            <button
              onClick={() => setModoTecnico(true)}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                modoTecnico
                  ? "bg-nebula-cyan text-space-background font-semibold"
                  : "text-space-text-muted hover:text-space-text"
              }`}
            >
              <Binary className="h-3.5 w-3.5" />
              <span>Modo Técnico</span>
            </button>
          </div>
        </div>

        {isLoading && !data && (
          <p className="text-sm text-space-text-muted">Calculando os astros visíveis no horizonte cearense...</p>
        )}

        {data && (
          <>
            {/* RN001 / MSG020: de dia nenhum planeta é listado */}
            {ehDia && data.mensagem && (
              <div
                role="status"
                className="mb-5 rounded-2xl border border-stellar-amber/30 bg-stellar-amber/10 p-4 text-sm text-lunar-silver"
              >
                {data.mensagem}
              </div>
            )}

            {!ehDia && destaques.length === 0 && (
              <p className="mb-5 text-sm text-space-text-muted">
                Nenhum dos planetas principais está acima do horizonte agora. A Lua continua sendo o melhor alvo.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {destaques.map((planeta) => (
                <CartaoPlaneta key={planeta.nome} planeta={planeta} modoTecnico={modoTecnico} />
              ))}
              <CartaoLua data={data} modoTecnico={modoTecnico} />
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
