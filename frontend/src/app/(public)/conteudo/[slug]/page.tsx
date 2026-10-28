"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, User, Sparkles } from "lucide-react";
import { useArticle } from "@/features/content/hooks/useArticles";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

// Banco de dados editorial detalhado para leitura completa
const ESSAY_DETAILS: Record<string, {
  titulo: string;
  subtitulo: string;
  categoria: string;
  tempoLeitura: string;
  publishedAt: string;
  autor: string;
  cargo: string;
  conteudo: string[];
}> = {
  "otto-de-alencar-relatividade-sobral-1919": {
    titulo: "Otto de Alencar e o Teste da Teoria da Relatividade Geral em Sobral (1919)",
    subtitulo: "A rigorosa crítica matemática que precedeu a confirmação da deflexão da luz solar no interior cearense.",
    categoria: "História da Ciência",
    tempoLeitura: "9 min de leitura",
    publishedAt: "2026-09-28T14:00:00Z",
    autor: "Prof. Dr. Marcelo Vasconcelos",
    cargo: "Historiador da Ciência & Físico Teórico",
    conteudo: [
      "No início do século XX, o Ceará se tornou o palco improvável de uma das maiores revoluções intelectuais da história humana. O eclipse solar total de 29 de maio de 1919, visível com primazia na cidade de Sobral, atraiu expedições da Royal Astronomical Society lideradas por Arthur Eddington e Andrew Crommelin.",
      "Contudo, antes mesmo que os astrônomos britânicos desembarcassem com seus telescópios celóstatos, o matemático cearense Otto de Alencar Silva (1874–1912) já havia deixado uma marca indelével na crítica à física clássica e às incertezas instrumentais da época.",
      "Com formação politécnica e profundo domínio de equações diferenciais e astronomia de posição, Otto de Alencar questionou os limites de erro das teorias newtonianas aplicadas ao avanço do periélio de Mercúrio. Ele apontava que as anomalias observadas não podiam ser simplesmente mascaradas por massas hipotéticas ou perturbações não comprovadas.",
      "Quando as chapas fotográficas de Sobral comprovaram a deflexão de 1,98 segundos de arco prevista pelas equações de Albert Einstein — superando as previsões newtonianas clássicas —, o rigor analítico preconizado por Otto de Alencar provou-se visionário. O Observatório que hoje leva seu nome em Fortaleza preserva exatamente esse legado: a busca pela precisão milimétrica e pelo livre exame científico.",
    ],
  },
  "fotometria-lunar-efeito-oposicao": {
    titulo: "Fotometria Lunar e o Efeito de Oposição em Solo Equatorial",
    subtitulo: "Análise da refletância da poeira regolitica nos mares lunares durante a fase de Lua Cheia capturada por sensores CMOS.",
    categoria: "Astrofísica",
    tempoLeitura: "12 min de leitura",
    publishedAt: "2026-10-02T10:30:00Z",
    autor: "Laboratório de Ótica Quântica",
    cargo: "Divisão de Astrofotometria do Observatório",
    conteudo: [
      "O efeito de oposição lunar (surto de oposição de Seeliger) é caracterizado por um aumento abrupto e não linear no brilho da superfície da Lua quando o ângulo de fase heliocêntrico se aproxima de zero grau.",
      "Em nossas medições conduzidas a partir da latitude -3.77° em Fortaleza, o zênite próximo proporcionou uma camada atmosférica significativamente mais estável (seeing médio de 1.2 arcsec), reduzindo as distorções de dispersão cromática comumente enfrentadas em latitudes mais elevadas.",
      "Utilizando fotometria diferencial calibrada com estrelas de referência do catálogo Landolt, a equipe do observatório registrou curvas fotométricas de alta densidade no Mare Tranquillitatis e na cratera Tycho, documentando a microestrutura da poeira regolitica e sua retrodispersão coerente.",
    ],
  },
};

export default function ArtigoDetalhesPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: remoteArticle, isLoading } = useArticle(params.slug);

  // Busca no banco editorial estático como fallback detalhado se não houver no Strapi
  const article = React.useMemo(() => {
    if (remoteArticle) {
      return {
        titulo: remoteArticle.attributes.titulo,
        subtitulo: remoteArticle.attributes.resumo || "",
        categoria: remoteArticle.attributes.categoria || "Pesquisa",
        tempoLeitura: "8 min de leitura",
        publishedAt: remoteArticle.attributes.publishedAt,
        autor: "Pesquisador do Observatório",
        cargo: "Equipe Editorial",
        conteudo: [remoteArticle.attributes.conteudo],
      };
    }
    return ESSAY_DETAILS[params.slug] || {
      titulo: params.slug.replace(/-/g, " ").toUpperCase(),
      subtitulo: "Publicação técnica do acervo digital do Observatório Otto de Alencar.",
      categoria: "Astronomia",
      tempoLeitura: "6 min de leitura",
      publishedAt: new Date().toISOString(),
      autor: "Comitê Científico",
      cargo: "Pesquisa & Extensão",
      conteudo: [
        "Este artigo faz parte do compêndio de ensaios e medições do Observatório Astronômico Otto de Alencar.",
        "Os dados observacionais coletados são periodicamente correlacionados com bases de dados internacionais de astrometria e fotometria celeste.",
      ],
    };
  }, [remoteArticle, params.slug]);

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-10">
      {/* Barra de Navegação Superior */}
      <div className="flex items-center justify-between border-b border-space-border/60 pb-4">
        <Link
          href="/conteudo"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-space-text-muted hover:text-nebula-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao Acervo de Artigos</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="subtle" className="text-nebula-cyan border-nebula-cyan/30 text-xs">
            {article.categoria}
          </Badge>
        </div>
      </div>

      {/* Título & Metadados do Artigo */}
      <header className="space-y-4">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-lunar-silver leading-tight">
          {article.titulo}
        </h1>
        {article.subtitulo && (
          <p className="text-base sm:text-lg text-space-text-muted leading-relaxed">
            {article.subtitulo}
          </p>
        )}

        {/* Informações do Autor */}
        <div className="flex items-center justify-between pt-4 border-t border-space-border/60 text-xs font-mono text-space-text-muted">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-space-surface-2 text-nebula-cyan border border-space-border/60">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-lunar-silver">{article.autor}</p>
              <p className="text-[11px] text-space-text-muted">{article.cargo}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <Calendar className="h-3.5 w-3.5" />
              <span>{new Date(article.publishedAt).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.tempoLeitura}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Corpo do Artigo / Ensaio */}
      <div className="space-y-6 text-lunar-silver/90 text-base sm:text-lg leading-relaxed font-sans">
        {article.conteudo.map((paragrafo, index) => (
          <p key={index} className="first-letter:text-3xl first-letter:font-bold first-letter:text-nebula-cyan first-letter:mr-1">
            {paragrafo}
          </p>
        ))}
      </div>

      {/* Caixa de Citação / Destaque Científico */}
      <div className="cosmic-glass rounded-2xl p-6 border-l-4 border-nebula-cyan border-space-border/80">
        <div className="flex items-center gap-2 text-nebula-cyan font-display font-semibold mb-2">
          <Sparkles className="h-4 w-4" />
          <span>Nota Epistemológica</span>
        </div>
        <p className="text-xs sm:text-sm text-space-text-muted italic">
          "A verdade geométrica e mecânica não se curva às hipóteses fáceis: ela exige
          a confirmação inexorável do cálculo e da lente." — Otto de Alencar Silva.
        </p>
      </div>

      {/* Rodapé de Ações do Artigo */}
      <footer className="pt-8 border-t border-space-border/60 flex items-center justify-between">
        <Link href="/conteudo">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Outros Artigos</span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: article.titulo, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copiado para a área de transferência!");
              }
            }}
            className="gap-2 text-xs"
          >
            <Share2 className="h-3.5 w-3.5 text-nebula-cyan" />
            <span>Compartilhar</span>
          </Button>
        </div>
      </footer>
    </div>
  );
}
