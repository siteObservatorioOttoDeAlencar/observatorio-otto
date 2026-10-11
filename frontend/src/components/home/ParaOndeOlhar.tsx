"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, ArrowUpRight, Navigation, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";

/**
 * 🎓 SEÇÃO DE ORIENTAÇÃO ESPACIAL URBANA (ParaOndeOlhar)
 * 
 * Por que este componente foi pensado assim?
 * A maioria das pessoas desiste de observar o céu quando vê termos como "Azimute 275°" ou "Declinação -16°".
 * 
 * Em vez de forçar o usuário a virar um astrônomo técnico, nós conectamos a astronomia
 * com a geografia e o dia a dia da cidade de Fortaleza:
 * - Leste = Nascente / Sentido Praia do Futuro e Beira-Mar
 * - Oeste = Poente / Sentido Sertão / Aeroporto
 * - Zênite = Alto da cabeça (onde a atmosfera é mais limpa e tem menos poluição luminosa)
 * 
 * É uma ponte didática perfeita entre dados científicos e o mundo real!
 */
export function ParaOndeOlhar() {
  return (
    <section id="onde-olhar" className="py-12 sm:py-16 md:py-20 relative border-b border-white/[0.08] scroll-mt-16">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider text-nebula-cyan uppercase">
              <Compass className="h-3.5 w-3.5" />
              <span>Orientação Espacial Intuitiva</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">
              Para Onde Olhar Esta Noite
            </h2>
            <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
              Use referências da sua cidade (onde o Sol nasce ou se põe) para encontrar os pontos principais sem precisar de cartas celestes complexas.
            </p>
          </div>

          <Link
            href="/ceu-hoje#radar"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-lunar-silver hover:text-nebula-cyan transition-colors self-start md:self-auto shrink-0"
          >
            <span>ABRIR RADAR POLAR EM TEMPO REAL</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Quadrantes Humanos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Leste */}
          <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-nebula-cyan font-bold flex items-center gap-1.5">
                <Navigation className="h-4 w-4 rotate-90" />
                LESTE (Nascente)
              </span>
              <span className="text-space-text-muted">Praia do Futuro / Beira Mar</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Júpiter & Órion
            </h3>
            <p className="text-xs text-space-text-muted leading-relaxed">
              Olhe na direção onde o Sol nasce. A partir das 20h, Júpiter surge imponente e brilhante, acompanhado pelas Três Marias logo em seguida.
            </p>
            <div className="pt-2 text-[11px] font-mono text-aurora-green">
              Alvo mais fácil da noite
            </div>
          </div>

          {/* Alto da Cabeça */}
          <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-stellar-amber font-bold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                ALTO DA CABEÇA (Zênite)
              </span>
              <span className="text-space-text-muted">Ponto mais alto</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Lua Crescente
            </h3>
            <p className="text-xs text-space-text-muted leading-relaxed">
              Em Fortaleza (-3.77°), a trajetória lunar passa praticamente no zênite. É o local com menor poluição luminosa e atmosfera mais limpa.
            </p>
            <div className="pt-2 text-[11px] font-mono text-stellar-amber">
              Excelente nitidez ótica
            </div>
          </div>

          {/* Oeste */}
          <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lunar-silver font-bold flex items-center gap-1.5">
                <Navigation className="h-4 w-4 -rotate-90" />
                OESTE (Poente)
              </span>
              <span className="text-space-text-muted">Lado do Pôr do Sol</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Vênus (Crepúsculo)
            </h3>
            <p className="text-xs text-space-text-muted leading-relaxed">
              A chamada "Estrela D'Alva" brilha intensamente logo que o Sol se põe, mas desaparece abaixo do horizonte por volta das 19h30.
            </p>
            <div className="pt-2 text-[11px] font-mono text-space-text-muted">
              Janela curta ao entardecer
            </div>
          </div>

          {/* Noroeste */}
          <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-lunar-silver font-bold flex items-center gap-1.5">
                <Navigation className="h-4 w-4 -rotate-45" />
                NOROESTE
              </span>
              <span className="text-space-text-muted">Acima do horizonte</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              Saturno
            </h3>
            <p className="text-xs text-space-text-muted leading-relaxed">
              Ponto amarelado solitário na constelação de Aquário. Visível confortavelmente do início da noite até cerca de 22h30.
            </p>
            <div className="pt-2 text-[11px] font-mono text-nebula-cyan">
              Requer telescópio para anéis
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
