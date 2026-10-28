"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Clock, ArrowUpRight, Compass } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

interface ObjetoCuradoria {
  id: string;
  nome: string;
  categoria: string;
  horarioIdeal: string;
  dificuldade: "A olho nu" | "Binóculo" | "Telescópio";
  dificuldadeVariant: "visible" | "cyan" | "amber";
  descricao: string;
  imagemUrl: string;
  constelacao: string;
  destaqueCientifico: string;
}

const ALVOS_CELESTES: ObjetoCuradoria[] = [
  {
    id: "jupiter-luas",
    nome: "Júpiter & Trânsito Galileano",
    categoria: "Gigante Gasoso",
    horarioIdeal: "20:30 às 23:45",
    dificuldade: "A olho nu",
    dificuldadeVariant: "visible",
    descricao:
      "Apresenta magnitude negativa intensa a leste. Com óptica modesta é possível acompanhar o eclipse e deslocamento das quatro maiores luas do sistema solar.",
    imagemUrl:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Touro",
    destaqueCientifico: "Distância: ~628M km",
  },
  {
    id: "nebulosa-orion",
    nome: "Grande Nebulosa de Órion (M42)",
    categoria: "Berçário de Protoestrelas",
    horarioIdeal: "21:00 às 02:00",
    dificuldade: "Binóculo",
    dificuldadeVariant: "cyan",
    descricao:
      "Uma das mais ativas regiões de formação estelar da nossa galáxia, visível em contraste espetacular logo abaixo do cinturão das Três Marias.",
    imagemUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Órion",
    destaqueCientifico: "1.344 anos-luz",
  },
  {
    id: "pleiades-m45",
    nome: "Plêiades — Aglomerado Aberto",
    categoria: "Estrelas Jovens B",
    horarioIdeal: "19:45 às 01:15",
    dificuldade: "A olho nu",
    dificuldadeVariant: "visible",
    descricao:
      "Aglomerado com mais de mil estrelas azuis quentes envoltas por uma sutil nebulosa de reflexão de poeira cósmica interestelar.",
    imagemUrl:
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Touro",
    destaqueCientifico: "Idade: ~100M anos",
  },
  {
    id: "saturno-aneis",
    nome: "Saturno e Sistema de Anéis",
    categoria: "Planeta Anelar",
    horarioIdeal: "Anoitecer até 22:00",
    dificuldade: "Telescópio",
    dificuldadeVariant: "amber",
    descricao:
      "Brilho estável de cor palha. Revela ao telescópio a Divisão de Cassini e a atmosfera densa do satélite Titã com nitidez notável no céu equatorial.",
    imagemUrl:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Aquário",
    destaqueCientifico: "Inclinação anéis: 9.8°",
  },
];

export function DescobertaCuradoria() {
  return (
    <section className="py-24 sm:py-32 relative">
      <Container size="default">
        {/* Cabeçalho de Narrativa 2: Descoberta */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Janela de Oportunidade • Fase 02: Descoberta
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              O Que o Céu nos Revela Esta Noite
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Alvos de magnitude favorável para as coordenadas de Fortaleza selecionados pelos astrônomos do observatório.
            </p>
          </div>

          <Link
            href="/ceu-hoje"
            className="inline-flex items-center gap-2 text-sm font-semibold text-nebula-cyan hover:text-nebula-cyan/80 transition-colors group shrink-0"
          >
            <span>Ver coordenadas completas em tempo real</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid com Motion Hover e Profundidade Linear/Apple */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALVOS_CELESTES.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group relative rounded-2xl overflow-hidden cosmic-glass border border-white/10 hover:border-nebula-cyan/40 transition-colors flex flex-col justify-between shadow-cosmic-sm hover:shadow-glow-cyan"
            >
              {/* Imagem Editorial */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-space-surface-2">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imagemUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-surface-1 via-space-surface-1/40 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge variant={item.dificuldadeVariant}>{item.dificuldade}</Badge>
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 font-mono text-[10px] text-lunar-silver border border-white/10">
                    {item.constelacao}
                  </span>
                </div>
              </div>

              {/* Informações Técnicas e Narrativas */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-nebula-cyan">
                    <span>{item.categoria}</span>
                    <span className="text-space-text-muted">{item.destaqueCientifico}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                    {item.nome}
                  </h3>
                  <p className="text-xs text-space-text-muted leading-relaxed line-clamp-3">
                    {item.descricao}
                  </p>
                </div>

                <div className="pt-3 border-t border-space-border/50 flex items-center justify-between text-xs font-mono text-space-text-muted">
                  <span className="flex items-center gap-1.5 text-lunar-silver">
                    <Clock className="h-3.5 w-3.5 text-stellar-amber" />
                    {item.horarioIdeal}
                  </span>
                  <span className="text-nebula-cyan flex items-center gap-0.5 group-hover:underline">
                    Dados <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
