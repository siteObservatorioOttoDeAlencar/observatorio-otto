"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

const ARTIGOS_NARRATIVA = [
  {
    id: 1,
    slug: "eclipse-solar-historico-sobral-otto-alencar",
    titulo: "Otto de Alencar e as Medições do Histórico Eclipse de Sobral",
    resumo:
      "A contribuição do matemático cearense na checagem dos parâmetros trigonométricos da deflexão da luz comprovada no Ceará em 1919.",
    categoria: "História & Teoria",
    data: "10 Out 2026",
    tempoLeitura: "6 min",
    imagemUrl:
      "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "guia-astrofotografia-ceu-urbano-fortaleza",
    titulo: "Astrofotografia em Céus Tropicais: Superando o Seeing Urbano",
    resumo:
      "Filtros de banda estreita e métodos de alinhamento por deriva adaptados às variações térmicas da costa litorânea de Fortaleza.",
    categoria: "Instrumentação",
    data: "05 Out 2026",
    tempoLeitura: "8 min",
    imagemUrl:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "transito-planetario-jupiter-e-saturno",
    titulo: "A Mecânica Orbital da Oposição de Júpiter e Saturno no Equador",
    resumo:
      "Como a declinação positiva destes planetas oferece aos observadores do Nordeste uma visão menos distorcida pela massa de ar atmosférica.",
    categoria: "Mecânica Celeste",
    data: "28 Set 2026",
    tempoLeitura: "5 min",
    imagemUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export function PublicacoesCientificas() {
  return (
    <section className="py-24 sm:py-32 relative border-t border-space-border/40">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" />
              Divulgação Científica • Fase 04: Conhecimento
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              Pesquisas & Registros Editoriais
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Artigos produzidos pelo corpo de pesquisadores do observatório sobre instrumentação, astrofísica e história da ciência brasileira.
            </p>
          </div>

          <Link
            href="/conteudo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-nebula-cyan hover:text-nebula-cyan/80 transition-colors group shrink-0"
          >
            <span>Acessar acervo completo de artigos</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid Editorial Stripe / Vercel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTIGOS_NARRATIVA.map((artigo, idx) => (
            <motion.div
              key={artigo.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={`/conteudo/${artigo.slug}`}
                className="group flex flex-col justify-between h-full rounded-2xl overflow-hidden cosmic-glass border border-white/10 hover:border-nebula-cyan/40 transition-colors shadow-cosmic-sm hover:shadow-glow-cyan"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-space-surface-2">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url('${artigo.imagemUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-surface-1 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="cyan">{artigo.categoria}</Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-lunar-silver group-hover:text-nebula-cyan transition-colors leading-snug">
                      {artigo.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed line-clamp-3">
                      {artigo.resumo}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-space-border/50 flex items-center justify-between text-xs font-mono text-space-text-muted">
                    <span className="flex items-center gap-1.5 text-lunar-silver">
                      <Calendar className="h-3.5 w-3.5 text-nebula-cyan" />
                      {artigo.data}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {artigo.tempoLeitura}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
