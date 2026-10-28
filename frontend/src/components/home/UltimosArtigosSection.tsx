import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Clock } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// Exemplos enriquecidos de artigos astronômicos enquanto integramos com o Strapi
const ARTIGOS_EM_DESTAQUE = [
  {
    id: 1,
    slug: "eclipse-solar-historico-sobral-otto-alencar",
    titulo: "Otto de Alencar e a Comprovação da Teoria da Relatividade em Sobral",
    resumo:
      "Uma retrospectiva documental sobre como os cálculos geodésicos do matemático cearense auxiliaram os pesquisadores britânicos no eclipse de 1919.",
    categoria: "História da Ciência",
    data: "10 de Outubro, 2026",
    tempoLeitura: "6 min de leitura",
    imagemUrl:
      "https://images.unsplash.com/photo-1532635241-17e820acc59f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "guia-astrofotografia-ceu-urbano-fortaleza",
    titulo: "Guia Prático: Como Capturar Imagens do Céu Profundo em Fortaleza",
    resumo:
      "Técnicas de empilhamento de quadros (stacking) e filtros de poluição luminosa para astrofotógrafos urbanos e iniciantes.",
    categoria: "Astrofotografia",
    data: "05 de Outubro, 2026",
    tempoLeitura: "8 min de leitura",
    imagemUrl:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "transito-planetario-jupiter-e-saturno",
    titulo: "A Dança dos Gigantes: Oposição Favorável de Júpiter e Saturno no Ceará",
    resumo:
      "Análise da trajetória orbital que colocará os maiores planetas do sistema solar em posição privilegiada de observação nas próximas semanas.",
    categoria: "Efemérides",
    data: "28 de Setembro, 2026",
    tempoLeitura: "4 min de leitura",
    imagemUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
  },
];

export function UltimosArtigosSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <Container size="default">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-nebula-cyan text-xs font-mono uppercase tracking-widest">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Publicações & Divulgação</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              Descobertas & Artigos Recentes
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Textos informativos, estudos de efemérides e tutoriais práticos produzidos por astrônomos do observatório.
            </p>
          </div>

          <Link
            href="/conteudo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-nebula-cyan hover:text-nebula-cyan/80 transition-colors group shrink-0"
          >
            <span>Ver todas as publicações</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid Editorial Estilo Stripe / Vercel Blog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ARTIGOS_EM_DESTAQUE.map((artigo) => (
            <Link key={artigo.id} href={`/conteudo/${artigo.slug}`} className="group block">
              <Card
                variant="interactive"
                padding="none"
                className="overflow-hidden h-full flex flex-col justify-between border-space-border/70 group-hover:border-nebula-cyan/40"
              >
                {/* Imagem de Capa Ampla com Aspect Ratio 16:9 */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-space-surface-2">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url('${artigo.imagemUrl}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-surface-1 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <Badge variant="cyan">{artigo.categoria}</Badge>
                  </div>
                </div>

                {/* Conteúdo */}
                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-lunar-silver group-hover:text-nebula-cyan transition-colors leading-snug">
                      {artigo.titulo}
                    </h3>
                    <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed line-clamp-3">
                      {artigo.resumo}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-space-border/50 flex items-center justify-between text-xs text-space-text-muted font-mono">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-nebula-cyan" />
                      {artigo.data}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {artigo.tempoLeitura}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
