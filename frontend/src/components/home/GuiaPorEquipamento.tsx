"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Compass, Telescope, Sparkles, Check, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

/**
 * 🎓 GUIA DE OBSERVAÇÃO POR EQUIPAMENTO (GuiaPorEquipamento)
 * 
 * Princípio Pedagógico e de Acessibilidade:
 * Um dos maiores preconceitos do público em geral é achar que astronomia só funciona
 * para quem tem um telescópio de R$ 5.000 ou mora no deserto.
 * 
 * Este componente desmistifica isso ao dividir a experiência em 3 níveis claros:
 * 1. A Olho Nu: Mostra o que dá para ver agora mesmo da janela ou da calçada da sua casa.
 * 2. Com Binóculo: Explica como um binóculo simples de feira ou herança de família já revela crateras lunares e luas de Júpiter.
 * 3. Com Telescópio: Mostra o salto de detalhes nos anéis de Saturno e nebulosas.
 * 
 * O estado `tabAtiva` alterna entre os níveis sem recarregar a página, mantendo a experiência fluida.
 */
type EquipamentoTab = "olho-nu" | "binoculo" | "telescopio";

export function GuiaPorEquipamento() {
  const [tabAtiva, setTabAtiva] = React.useState<EquipamentoTab>("olho-nu");

  return (
    <section className="py-12 sm:py-16 md:py-20 relative border-b border-white/[0.08] bg-space-surface-1/40">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-nebula-cyan uppercase">
            <Telescope className="h-3.5 w-3.5" />
            <span>Orientação Prática de Observação</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
            O Que Eu Consigo Ver Com o Que Tenho?
          </h2>
          <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
            Você não precisa de equipamentos caros para começar. Escolha o que você tem à mão e veja exatamente o que é possível encontrar no céu da cidade.
          </p>
        </div>

        {/* Abas de Equipamento */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setTabAtiva("olho-nu")}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 ${
              tabAtiva === "olho-nu"
                ? "bg-nebula-cyan text-space-background font-semibold shadow-sm"
                : "bg-space-surface-2 text-space-text-muted hover:text-white border border-white/[0.06]"
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>👁 A Olho Nu (Na Calçada)</span>
          </button>

          <button
            onClick={() => setTabAtiva("binoculo")}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 ${
              tabAtiva === "binoculo"
                ? "bg-nebula-cyan text-space-background font-semibold shadow-sm"
                : "bg-space-surface-2 text-space-text-muted hover:text-white border border-white/[0.06]"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>🔭 Com Binóculo Simples</span>
          </button>

          <button
            onClick={() => setTabAtiva("telescopio")}
            className={`px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all flex items-center gap-2 ${
              tabAtiva === "telescopio"
                ? "bg-nebula-cyan text-space-background font-semibold shadow-sm"
                : "bg-space-surface-2 text-space-text-muted hover:text-white border border-white/[0.06]"
            }`}
          >
            <Telescope className="h-4 w-4" />
            <span>🌌 Com Telescópio</span>
          </button>
        </div>

        {/* Conteúdo Dinâmico por Equipamento */}
        <div className="rounded-2xl p-6 sm:p-8 bg-space-surface-1 border border-white/[0.08] shadow-sm">
          {tabAtiva === "olho-nu" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-aurora-green/10 text-aurora-green flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-display text-base font-bold text-white">Júpiter e Vênus</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Os astros mais brilhantes da noite. Diferente das estrelas, a luz dos planetas é contínua e quase não pisca.
                </p>
                <span className="inline-block text-[11px] font-mono text-nebula-cyan">Fácil mesmo no Centro ou Aldeota</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-aurora-green/10 text-aurora-green flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-display text-base font-bold text-white">Mares e Fases da Lua</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  As grandes manchas escuras (antigas bacias de lava vulcânica) e o contorno da fase atual são perfeitamente visíveis.
                </p>
                <span className="inline-block text-[11px] font-mono text-nebula-cyan">Visível em toda Fortaleza</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-aurora-green/10 text-aurora-green flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-display text-base font-bold text-white">Constelação de Órion</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  As famosas "Três Marias" (cinturão de Órion) e as estrelas gigantes Betelgeuse (avermelhada) e Rigel (azulada).
                </p>
                <span className="inline-block text-[11px] font-mono text-nebula-cyan">Olhe para o Leste por volta das 21h</span>
              </div>
            </div>
          )}

          {tabAtiva === "binoculo" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-nebula-cyan/10 text-nebula-cyan flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-display text-base font-bold text-white">Luas de Júpiter</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Com um binóculo 7x50 ou 10x50 bem apoiado, 4 pontos brilhantes aparecem em fila ao redor do planeta: as luas galileanas.
                </p>
                <span className="inline-block text-[11px] font-mono text-stellar-amber">Apoie os cotovelos para estabilizar</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-nebula-cyan/10 text-nebula-cyan flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-display text-base font-bold text-white">Crateras e Cordilheiras Lunares</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Centenas de crateras de impacto, montanhas e falhas geológicas ganham profundidade tridimensional.
                </p>
                <span className="inline-block text-[11px] font-mono text-stellar-amber">Experiência incrível para crianças</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-nebula-cyan/10 text-nebula-cyan flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-display text-base font-bold text-white">Aglomerado das Plêiades (M45)</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Conhecido popularmente como "Sete Estrelo". Um punhado de dezenas de estrelas azuis jovens brilhando juntas.
                </p>
                <span className="inline-block text-[11px] font-mono text-stellar-amber">Perto de Júpiter em Touro</span>
              </div>
            </div>
          )}

          {tabAtiva === "telescopio" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-stellar-amber/10 text-stellar-amber flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h4 className="font-display text-base font-bold text-white">Anéis e Titã em Saturno</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  A divisão escura entre os anéis (Divisão de Cassini) e a grande lua Titã tornam-se inconfundíveis com abertura &gt; 70mm.
                </p>
                <span className="inline-block text-[11px] font-mono text-aurora-green">Melhor até as 21h30</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-stellar-amber/10 text-stellar-amber flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h4 className="font-display text-base font-bold text-white">Faixas Atmosféricas de Júpiter</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  As listras equatoriais de nuvens de gás marrom e, em noites estáveis, a Grande Mancha Vermelha cruzando o disco.
                </p>
                <span className="inline-block text-[11px] font-mono text-aurora-green">Use aumento entre 80x e 150x</span>
              </div>

              <div className="space-y-2">
                <div className="h-8 w-8 rounded-lg bg-stellar-amber/10 text-stellar-amber flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h4 className="font-display text-base font-bold text-white">Grande Nebulosa de Órion (M42)</h4>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Um berçário de estrelas a 1.300 anos-luz. O gás esbranquiçado e o grupo de 4 estrelas centrais (Trapézio) são visíveis.
                </p>
                <span className="inline-block text-[11px] font-mono text-aurora-green">Céu profundo clássico</span>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
