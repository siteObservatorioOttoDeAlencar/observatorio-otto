import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

const ARTIGOS_STRIPE = [
  {
    id: 1,
    slug: "eclipse-solar-historico-sobral-otto-alencar",
    titulo: "Otto de Alencar e as Equações Geodésicas do Histórico Eclipse de 1919 em Sobral",
    resumo:
      "Uma investigação arquivística e matemática demonstrando como os cálculos de coordenadas do cientista cearense permitiram aos astrônomos de Greenwich confirmar a teoria da Relatividade Geral.",
    categoria: "HISTÓRIA DA CIÊNCIA",
    data: "10 de Outubro, 2026",
    tempoLeitura: "6 min de leitura",
    destaque: true,
    autor: "Prof. Dr. Marcelo Vasconcelos",
  },
  {
    id: 2,
    slug: "guia-astrofotografia-ceu-urbano-fortaleza",
    titulo: "Astrofotografia no Equador Terrestre: Desafios e Técnicas para o Seeing de Fortaleza",
    resumo:
      "Métodos de alinhamento por deriva e uso de filtros narrow-band para contornar a umidade marítima e a poluição luminosa costeira.",
    categoria: "INSTRUMENTAÇÃO",
    data: "05 de Outubro, 2026",
    tempoLeitura: "8 min de leitura",
    destaque: false,
    autor: "Equipe de Astrofísica",
  },
  {
    id: 3,
    slug: "transito-planetario-jupiter-e-saturno",
    titulo: "A Mecânica Orbital da Grande Oposição dos Planetas Gasosos na Próxima Década",
    resumo:
      "Projeções computacionais do modelo DE421 da NASA indicando os melhores períodos de observação para telescópios refletores no Nordeste brasileiro.",
    categoria: "MECÂNICA CELESTE",
    data: "28 de Setembro, 2026",
    tempoLeitura: "5 min de leitura",
    destaque: false,
    autor: "Observatório Otto de Alencar",
  },
];

export function ArtigosStripeBlog() {
  const artigoPrincipal = ARTIGOS_STRIPE[0];
  const artigosSecundarios = ARTIGOS_STRIPE.slice(1);

  return (
    <section className="py-14 sm:py-20 md:py-24 relative border-b border-white/[0.08]">
      <Container size="default">
        {/* Cabeçalho Editorial Estilo Stripe Press / Stripe Blog */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-[11px] tracking-widest text-nebula-cyan uppercase block">
              PUBLICAÇÕES & PAPERS DA REVISTA
            </span>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Pesquisas, Ensaios & Histórias
            </h2>
            <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed">
              Leituras aprofundadas com rigor acadêmico, documentação histórica e guias de instrumentação produzidos pelos pesquisadores do observatório.
            </p>
          </div>

          <Link
            href="/conteudo"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-lunar-silver hover:text-nebula-cyan transition-colors group shrink-0 min-h-[36px]"
          >
            <span>VER ÍNDICE COMPLETO DA REVISTA</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Layout de Revista Científica Inspirado no Stripe Blog (1 Ensaio Amplo + Coluna de Artigos Secundários) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Ensaio de Capa em Destaque (7 colunas) */}
          <div className="lg:col-span-7">
            <Link
              href={`/conteudo/${artigoPrincipal.slug}`}
              className="group block space-y-6"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-space-surface-2 border border-white/[0.08]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1200&auto=format&fit=crop')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-background via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-nebula-cyan border border-white/10 uppercase tracking-wider">
                    {artigoPrincipal.categoria}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 font-mono text-xs text-space-text-muted">
                  <span>{artigoPrincipal.data}</span>
                  <span>•</span>
                  <span>{artigoPrincipal.tempoLeitura}</span>
                  <span>•</span>
                  <span className="text-lunar-silver">{artigoPrincipal.autor}</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-nebula-cyan transition-colors leading-snug">
                  {artigoPrincipal.titulo}
                </h3>

                <p className="text-sm text-space-text-muted leading-relaxed">
                  {artigoPrincipal.resumo}
                </p>

                <div className="pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-nebula-cyan group-hover:underline">
                    Ler ensaio completo da revista <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Coluna de Artigos Secundários com Tipografia Stripe (5 colunas) */}
          <div className="lg:col-span-5 space-y-8 divide-y divide-white/[0.08]">
            {artigosSecundarios.map((artigo, idx) => (
              <div key={artigo.id} className={idx > 0 ? "pt-8" : ""}>
                <Link
                  href={`/conteudo/${artigo.slug}`}
                  className="group block space-y-3"
                >
                  <div className="flex items-center justify-between font-mono text-[11px] text-space-text-muted">
                    <span className="text-nebula-cyan uppercase tracking-wider">{artigo.categoria}</span>
                    <span>{artigo.tempoLeitura}</span>
                  </div>

                  <h4 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-nebula-cyan transition-colors leading-snug">
                    {artigo.titulo}
                  </h4>

                  <p className="text-xs text-space-text-muted leading-relaxed line-clamp-2">
                    {artigo.resumo}
                  </p>

                  <div className="flex items-center justify-between font-mono text-xs text-space-text-muted pt-1">
                    <span>{artigo.autor}</span>
                    <span className="text-lunar-silver flex items-center gap-1 group-hover:text-nebula-cyan">
                      Ler artigo <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}

            {/* Caixa Editorial de Acervo */}
            <div className="pt-8">
              <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/[0.08] space-y-3">
                <span className="font-mono text-[10px] text-stellar-amber uppercase tracking-wider block">
                  ACERVO HISTÓRICO
                </span>
                <h5 className="font-display text-base font-semibold text-white">
                  Consulte os Cadernos Originais de Otto de Alencar
                </h5>
                <p className="text-xs text-space-text-muted leading-relaxed">
                  Documentos digitalizados contendo cálculos trigonométricos e anotações originais do início do século XX.
                </p>
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-1 text-xs font-mono text-nebula-cyan hover:underline pt-1"
                >
                  Explorar acervo arquivístico →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
