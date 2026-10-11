import * as React from "react";
import { StrapiArticle } from "@/types/strapi";
import { formatDateTime } from "@/lib/utils/formatters";

interface ArticleRendererProps {
  article: StrapiArticle;
}

export function ArticleRenderer({ article }: ArticleRendererProps) {
  const { titulo, conteudo, publishedAt } = article.attributes;

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="font-display text-3xl font-bold text-lunar-silver mb-2">{titulo}</h1>
      <p className="text-xs text-space-text-muted mb-8">
        Publicado em: {formatDateTime(publishedAt)}
      </p>
      <div className="text-lunar-silver/90 leading-relaxed whitespace-pre-wrap">{conteudo}</div>
    </article>
  );
}
