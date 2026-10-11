"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Telescope, Award, Users, ArrowUpRight, Cpu } from "lucide-react";
import { Container } from "@/components/layout/Container";

const PILARES = [
  {
    titulo: "Telescópio Principal Otto de Alencar",
    subtitulo: "Instrumento de Alta Abertura",
    descricao:
      "Óptica configurada para levantamento fotométrico e astrofotografia de alta resolução. Ponto focal das noites de vigília científica no observatório.",
    icon: Telescope,
    link: "/sobre",
    tag: "Instrumentação Óptica",
  },
  {
    titulo: "Disseminação e Extensão Universitária",
    subtitulo: "Acesso Livre ao Conhecimento",
    descricao:
      "Aulas práticas abertas a escolas públicas, workshops de manuseio óptico e treinamento de astrônomos amadores para registro comunitário de dados.",
    icon: Users,
    link: "/sobre",
    tag: "Impacto Comunitário",
  },
  {
    titulo: "Memória da Ciência no Ceará",
    subtitulo: "Legado de Otto de Alencar Silva",
    descricao:
      "Homenagem permanente ao matemático e astrônomo cearense reconhecido mundialmente pelas correções de cálculo em medições de eclipses e mecânica celeste.",
    icon: Award,
    link: "/sobre",
    tag: "Patrimônio Histórico",
  },
  {
    titulo: "Motor Computacional Autônomo",
    subtitulo: "Engenharia de Efemérides",
    descricao:
      "Backend de alta performance em Python e algoritmos da NASA operando diretamente na instituição, garantindo independência de serviços proprietários.",
    icon: Cpu,
    link: "/ceu-hoje",
    tag: "Tecnologia Aberta",
  },
];

export function CredibilidadeInstitucional() {
  return (
    <section className="py-14 sm:py-20 md:py-24 relative bg-space-surface-1/30 border-t border-space-border/40">
      <Container size="default">
        {/* Cabeçalho de Narrativa 4: Credibilidade Científica */}
        <div className="max-w-3xl mb-8 sm:mb-12 space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan block">
            Fase 04: Credibilidade Científica • Pilares
          </span>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
            Tradição Acadêmica & Vanguarda Digital
          </h2>
          <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
            Mais do que um ponto de observação, o Observatório Digital é uma ponte entre o rigor da pesquisa matemática e a paixão pública pelo universo.
          </p>
        </div>

        {/* Grid Editorial com Hover Elevado e Transição Suave */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {PILARES.map((pilar, idx) => {
            const Icon = pilar.icon;
            return (
              <motion.div
                key={pilar.titulo}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="group h-full rounded-2xl p-5 sm:p-7 cosmic-glass border border-white/10 hover:border-nebula-cyan/40 transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-space-surface-2 border border-space-border flex items-center justify-center text-nebula-cyan group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-[11px] text-space-text-muted border border-space-border/80 rounded-full px-3 py-0.5 bg-space-surface-2">
                      {pilar.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-mono text-nebula-cyan uppercase tracking-wider block">
                      {pilar.subtitulo}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                      {pilar.titulo}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                    {pilar.descricao}
                  </p>
                </div>

                <div className="pt-6 border-t border-space-border/40 mt-6">
                  <Link
                    href={pilar.link}
                    className="flex items-center justify-between text-xs font-semibold text-lunar-silver group-hover:text-nebula-cyan transition-colors"
                  >
                    <span>Conhecer histórico e equipe</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
