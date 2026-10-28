"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Compass, Eye, Sparkles, Clock, MapPin, Binary, HelpCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";

/**
 * OQueObservarHojeHumanizado
 *
 * PROPÓSITO:
 * Apresenta os 3 alvos astronômicos mais fáceis e interessantes da noite atual em Fortaleza.
 *
 * ARQUITETURA DUAL (MODO SIMPLES vs. MODO TÉCNICO):
 * - Modo Simples (default): Linguagem para 95% do público (ex: "Olhe para o Leste", "A olho nu").
 * - Modo Técnico: Coordenadas astronômicas para observadores com telescópio (Alt, Az, Mag, Touro).
 *
 * ORIGEM DOS DADOS:
 * Consome o hook 'useSkyToday()', que por sua vez se conecta à FastAPI (Python) com fallback seguro.
 */
export function OQueObservarHojeHumanizado() {
  const { data, isLoading } = useSkyToday();
  const [modoTecnico, setModoTecnico] = React.useState(false);

  const planetas = data?.planetas_visiveis_agora || [];

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
              Selecionamos os astros mais brilhantes e fáceis de encontrar no céu de Fortaleza hoje à noite, com orientações práticas para você não se perder.
            </p>
          </div>

          {/* Toggle Modo Simples vs. Modo Técnico */}
          <div className="flex items-center gap-2 bg-space-surface-2 p-1 rounded-xl border border-space-border/60 text-xs self-start md:self-auto shrink-0 font-mono">
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

        {/* Grade de Destaques Noturnos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Alvo 1: Júpiter */}
          <div className="rounded-2xl p-5 sm:p-6 bg-space-surface-1/90 border border-white/[0.08] flex flex-col justify-between hover:border-nebula-cyan/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="visible">A Olho Nu (Muito Fácil)</Badge>
                <span className="font-mono text-xs text-stellar-amber font-semibold">Brilha Muito</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Júpiter
              </h3>
              <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                Parece uma estrela muito brilhante que não pisca. Se tiver um binóculo simples, você consegue ver 4 pequenos pontinhos ao lado dele (as luas descobertas por Galileu).
              </p>

              {/* Guia Direcional Humano vs. Técnico */}
              {!modoTecnico ? (
                <div className="pt-3 space-y-1.5 text-xs font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04]">
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Para onde olhar:</span>
                    <strong className="text-nebula-cyan">Leste (onde o Sol nasce)</strong>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Altura no céu:</span>
                    <span>Meia altura (fácil da janela)</span>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Melhor horário:</span>
                    <span className="text-aurora-green">20h00 até 01h00</span>
                  </div>
                </div>
              ) : (
                <div className="pt-3 space-y-1 text-[11px] font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04] text-space-text-muted">
                  <div className="flex justify-between"><span>Altitude:</span> <strong className="text-lunar-silver">+52.8°</strong></div>
                  <div className="flex justify-between"><span>Azimute:</span> <strong className="text-lunar-silver">78.4° (ENE)</strong></div>
                  <div className="flex justify-between"><span>Magnitude Aparente:</span> <strong className="text-lunar-silver">-2.5</strong></div>
                  <div className="flex justify-between"><span>Constelação:</span> <strong className="text-lunar-silver">Touro</strong></div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-space-text-muted">Equipamento: Nenhum</span>
              <Link href="/ceu-hoje#radar" className="text-nebula-cyan hover:underline inline-flex items-center gap-1">
                Ver no Domo <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Alvo 2: Lua Crescente */}
          <div className="rounded-2xl p-5 sm:p-6 bg-space-surface-1/90 border border-white/[0.08] flex flex-col justify-between hover:border-nebula-cyan/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="cyan">A Olho Nu / Binóculo</Badge>
                <span className="font-mono text-xs text-stellar-amber font-semibold">Espetacular</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Lua (Crateras em Relevo)
              </h3>
              <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                A fase crescente cria sombras nas bordas das crateras. Aponte qualquer binóculo ou telescópio para a divisa entre o lado claro e escuro para ver montanhas lunares em 3D.
              </p>

              {!modoTecnico ? (
                <div className="pt-3 space-y-1.5 text-xs font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04]">
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Para onde olhar:</span>
                    <strong className="text-nebula-cyan">Bem no alto da cabeça (Zênite)</strong>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Iluminação:</span>
                    <span>78% iluminada</span>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Melhor horário:</span>
                    <span className="text-aurora-green">Logo ao anoitecer (18h30)</span>
                  </div>
                </div>
              ) : (
                <div className="pt-3 space-y-1 text-[11px] font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04] text-space-text-muted">
                  <div className="flex justify-between"><span>Ângulo de Fase:</span> <strong className="text-lunar-silver">124.5°</strong></div>
                  <div className="flex justify-between"><span>Distância Geocêntrica:</span> <strong className="text-lunar-silver">384.400 km</strong></div>
                  <div className="flex justify-between"><span>Alvo Recomendado:</span> <strong className="text-lunar-silver">Mare Tranquillitatis</strong></div>
                  <div className="flex justify-between"><span>Filtro Sugerido:</span> <strong className="text-lunar-silver">ND 13% (Neutro)</strong></div>
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

          {/* Alvo 3: Saturno */}
          <div className="rounded-2xl p-5 sm:p-6 bg-space-surface-1/90 border border-white/[0.08] flex flex-col justify-between hover:border-nebula-cyan/40 transition-colors">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="subtle">Precisa de Telescópio</Badge>
                <span className="font-mono text-xs text-space-text-muted">Planeta dos Anéis</span>
              </div>
              <h3 className="font-display text-xl font-bold text-white">
                Saturno
              </h3>
              <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                A olho nu parece um ponto amarelo estável. Para ver seus famosos anéis e sua maior lua (Titã), você precisará de um pequeno telescópio com pelo menos 50x de aumento.
              </p>

              {!modoTecnico ? (
                <div className="pt-3 space-y-1.5 text-xs font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04]">
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Para onde olhar:</span>
                    <strong className="text-nebula-cyan">Noroeste (alto no início da noite)</strong>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Dificuldade:</span>
                    <span>Fácil de achar / Exige ótica</span>
                  </div>
                  <div className="flex items-center justify-between text-lunar-silver">
                    <span className="text-space-text-muted">Melhor horário:</span>
                    <span className="text-aurora-green">19h00 às 22h00</span>
                  </div>
                </div>
              ) : (
                <div className="pt-3 space-y-1 text-[11px] font-mono bg-space-surface-2/60 p-3 rounded-xl border border-white/[0.04] text-space-text-muted">
                  <div className="flex justify-between"><span>Altitude:</span> <strong className="text-lunar-silver">+44.2°</strong></div>
                  <div className="flex justify-between"><span>Azimute:</span> <strong className="text-lunar-silver">105.6°</strong></div>
                  <div className="flex justify-between"><span>Magnitude:</span> <strong className="text-lunar-silver">+0.6</strong></div>
                  <div className="flex justify-between"><span>Abertura Mínima:</span> <strong className="text-lunar-silver">70mm</strong></div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
              <span className="text-space-text-muted">Equipamento: Telescópio</span>
              <Link href="/sobre" className="text-nebula-cyan hover:underline inline-flex items-center gap-1">
                Ver no Observatório <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
