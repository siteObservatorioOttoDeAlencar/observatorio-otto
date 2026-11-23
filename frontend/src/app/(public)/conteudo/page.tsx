"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Search, Calendar, Clock, ArrowRight, Sparkles, Filter } from "lucide-react";
import { useArticles } from "@/features/content/hooks/useArticles";
import type { Artigo } from "@/features/content/types";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

// Acervo de reserva: aparece quando o CMS não responde ou ainda não tem artigos publicados.
const STATIC_FALLBACK_ARTICLES: Artigo[] = [
  {
    id: 1,
    titulo: "Otto de Alencar e o Teste da Teoria da Relatividade Geral em Sobral (1919)",
    slug: "otto-de-alencar-relatividade-sobral-1919",
    resumo: "Como o eminente matemático cearense analisou o eclipse total do Sol e influenciou o rigor das medições astronômicas no Brasil.",
    categoria: "História da Ciência",
    tempoLeitura: "9 min",
    publicadoEm: "2026-09-28T14:00:00Z",
    capaUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1000&auto=format&fit=crop",
    autor: "Prof. Dr. Marcelo Vasconcelos",
  },
  {
    id: 2,
    titulo: "Fotometria Lunar e o Efeito de Oposição em Solo Equatorial",
    slug: "fotometria-lunar-efeito-oposicao",
    resumo: "Análise da refletância da poeira regolitica nos mares lunares durante a fase de Lua Cheia capturada por sensores CMOS em Fortaleza.",
    categoria: "Astrofísica",
    tempoLeitura: "12 min",
    publicadoEm: "2026-10-02T10:30:00Z",
    capaUrl: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1000&auto=format&fit=crop",
    autor: "Laboratório de Ótica Quântica",
  },
  {
    id: 3,
    titulo: "Cartografia de Planetas Exteriores: A Dinâmica das Faixas Jovianas",
    slug: "cartografia-planetas-exteriores-faixas-jovianas",
    resumo: "Registro das variações cromáticas na Zona Equatorial de Júpiter e trânsito da Grande Mancha Vermelha com telescópios catadióptricos.",
    categoria: "Observacional",
    tempoLeitura: "7 min",
    publicadoEm: "2026-10-06T18:00:00Z",
    capaUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000&auto=format&fit=crop",
    autor: "Grupo de Astrofotografia Cearense",
  },
  {
    id: 4,
    titulo: "Calibração e Alinhamento Polar em Latitudes Equatoriais Baixas",
    slug: "calibracao-alinhamento-polar-latitudes-baixas",
    resumo: "Desafios específicos do alinhamento preciso de montagens equatoriais alemãs em Fortaleza (-3.77°), onde o polo celeste está próximo ao horizonte.",
    categoria: "Instrumentação",
    tempoLeitura: "15 min",
    publicadoEm: "2026-10-08T09:15:00Z",
    capaUrl: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=1000&auto=format&fit=crop",
    autor: "Eng. Ricardo Peixoto",
  },
];

export default function ConteudoPage() {
  const { data: artigosDoCms, isLoading } = useArticles();
  const [busca, setBusca] = React.useState("");
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("Todos");

  // Artigos publicados no CMS; sem eles (CMS fora do ar ou vazio), usa o acervo de reserva
  const articles: Artigo[] = React.useMemo(() => {
    if (artigosDoCms && artigosDoCms.length > 0) return artigosDoCms;
    return STATIC_FALLBACK_ARTICLES;
  }, [artigosDoCms]);

  const artigosFiltrados = React.useMemo(() => {
    const termo = busca.toLowerCase();
    return articles.filter((art) => {
      const matchBusca =
        art.titulo.toLowerCase().includes(termo) ||
        art.resumo.toLowerCase().includes(termo) ||
        art.autor.toLowerCase().includes(termo);
      const matchCategoria = categoriaAtiva === "Todos" || art.categoria === categoriaAtiva;
      return matchBusca && matchCategoria;
    });
  }, [articles, busca, categoriaAtiva]);

  const categorias = ["Todos", "Astrofísica", "História da Ciência", "Observacional", "Instrumentação"];

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8">
      {/* Cabeçalho Editorial */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-space-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
            <BookOpen className="h-3.5 w-3.5" />
            <span>REVISTA CIENTÍFICA & PAPERS</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
            Acervo de Artigos & Pesquisa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
            Ensaios acadêmicos, relatos técnicos de observação e análises históricas
            produzidas pelo corpo científico do Observatório Otto de Alencar.
          </p>
        </div>

        {/* Campo de Busca Rápida */}
        <div className="w-full md:w-72">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-space-text-muted" />
            <Input
              type="text"
              placeholder="Buscar por termo ou autor..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Categorias / Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="h-3.5 w-3.5 text-space-text-muted shrink-0 mr-1" />
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            className={`rounded-lg px-3.5 py-1.5 font-medium transition-all ${
              categoriaAtiva === cat
                ? "bg-nebula-cyan/20 text-nebula-cyan border border-nebula-cyan/40 shadow-cosmic-sm"
                : "border border-space-border/60 text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-1"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Artigos com Destaque Editorial */}
      {isLoading && !artigosDoCms ? (
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Artigo Principal em Destaque (Lead Essay) */}
          {artigosFiltrados.length > 0 && (
            <article className="group rounded-2xl p-6 sm:p-8 bg-space-surface-1 border border-white/[0.08] hover:border-nebula-cyan/30 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-space-text-muted">
                    <Badge variant="subtle" className="text-nebula-cyan border-nebula-cyan/30 text-[11px]">
                      {artigosFiltrados[0].categoria}
                    </Badge>
                    <span>•</span>
                    <span className="text-aurora-green font-medium">Ensaio em Destaque</span>
                    <span>•</span>
                    <div className="flex items-center gap-1 text-space-text-muted">
                      <Clock className="h-3 w-3" />
                      <span>{artigosFiltrados[0].tempoLeitura}</span>
                    </div>
                  </div>

                  <Link href={`/conteudo/${artigosFiltrados[0].slug}`}>
                    <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-space-text group-hover:text-nebula-cyan transition-colors leading-snug">
                      {artigosFiltrados[0].titulo}
                    </h2>
                  </Link>

                  <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed line-clamp-2 max-w-3xl">
                    {artigosFiltrados[0].resumo}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono text-space-text-muted">
                    <span>{artigosFiltrados[0].autor}</span>
                    <Link
                      href={`/conteudo/${artigosFiltrados[0].slug}`}
                      className="inline-flex items-center gap-1.5 font-medium text-nebula-cyan group-hover:translate-x-1 transition-transform"
                    >
                      <span>Ler Ensaio Completo</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 h-48 lg:h-52 rounded-xl overflow-hidden border border-white/[0.08] relative bg-space-surface-2">
                  {artigosFiltrados[0].capaUrl && (
                    <img
                      src={artigosFiltrados[0].capaUrl}
                      alt={artigosFiltrados[0].titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-space-background/80 via-transparent to-transparent" />
                </div>
              </div>
            </article>
          )}

          {/* Grid dos Demais Artigos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artigosFiltrados.slice(1).map((art) => {
              const { titulo, slug, resumo, categoria, tempoLeitura, autor } = art;
              return (
                <article
                  key={art.id}
                  className="group rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] flex flex-col justify-between hover:border-nebula-cyan/30 transition-all hover:bg-space-surface-2/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-mono text-space-text-muted">
                      <span className="text-nebula-cyan font-semibold">{categoria || "Astronomia"}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{tempoLeitura || "7 min"}</span>
                      </div>
                    </div>

                    <Link href={`/conteudo/${slug}`}>
                      <h3 className="font-display text-base font-bold text-space-text group-hover:text-nebula-cyan transition-colors leading-snug line-clamp-2">
                        {titulo}
                      </h3>
                    </Link>

                    <p className="text-xs text-space-text-muted leading-relaxed line-clamp-2">
                      {resumo || "Ensaio e dados coletados pela instrumentação do observatório."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-space-text-muted">
                    <span className="truncate max-w-[140px]">{autor}</span>
                    <Link
                      href={`/conteudo/${slug}`}
                      className="inline-flex items-center gap-1 text-nebula-cyan hover:underline shrink-0"
                    >
                      <span>Ler</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
