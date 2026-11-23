import * as React from "react";
import { RichText } from "@/components/content/RichText";
import { formatDateTime } from "@/lib/utils/formatters";
import type { Artigo } from "../types";

interface ArticleRendererProps {
  article: Artigo;
}

export function ArticleRenderer({ article }: ArticleRendererProps) {
  const { titulo, corpo, paragrafos, publicadoEm } = article;

  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="font-display text-3xl font-bold text-lunar-silver mb-2">{titulo}</h1>
      <p className="text-xs text-space-text-muted mb-8">
        Publicado em: {formatDateTime(publicadoEm)}
      </p>
      <div className="text-lunar-silver/90 leading-relaxed">
        {corpo ? (
          <RichText dados={corpo} />
        ) : (
          paragrafos?.map((p, i) => <p key={i}>{p}</p>)
        )}
      </div>
    </article>
  );
}
