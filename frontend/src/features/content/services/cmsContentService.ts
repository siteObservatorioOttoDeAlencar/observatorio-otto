import { cmsClient } from "@/lib/clients/cms-client";
import { textoPuro } from "@/components/content/RichText";
import { urlDaMidia } from "@/lib/cms/media";
import type { CategoriaNoticia, NoticiaCms, PayloadList } from "@/types/cms";
import type { Artigo } from "../types";

export const ROTULOS_CATEGORIA: Record<CategoriaNoticia, string> = {
  astrofisica: "Astrofísica",
  "historia-da-ciencia": "História da Ciência",
  observacional: "Observacional",
  instrumentacao: "Instrumentação",
};

/** Estimativa de leitura: ~200 palavras por minuto, no mínimo 1 min. */
export function tempoDeLeitura(texto: string): string {
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(palavras / 200))} min`;
}

export function noticiaParaArtigo(n: NoticiaCms): Artigo {
  return {
    id: n.id,
    titulo: n.titulo,
    slug: n.slug,
    resumo: n.resumo,
    categoria: (n.categoria && ROTULOS_CATEGORIA[n.categoria]) || "Astronomia",
    autor: n.autor || "Equipe do Observatório",
    tempoLeitura: tempoDeLeitura(textoPuro(n.corpo) || n.resumo),
    publicadoEm: n.dataPublicacao,
    capaUrl: urlDaMidia(n.capa),
    corpo: n.corpo ?? null,
  };
}

/**
 * Notícias e artigos publicados no Payload CMS.
 * O CMS só devolve ao público o que está publicado (rascunhos não aparecem).
 */
export const cmsContentService = {
  async getArtigos(): Promise<Artigo[]> {
    const { data } = await cmsClient.get<PayloadList<NoticiaCms>>("/api/noticias", {
      params: { sort: "-dataPublicacao", limit: 50, depth: 1 },
    });
    return data.docs.map(noticiaParaArtigo);
  },

  async getArtigoBySlug(slug: string): Promise<Artigo | null> {
    const { data } = await cmsClient.get<PayloadList<NoticiaCms>>("/api/noticias", {
      params: { "where[slug][equals]": slug, limit: 1, depth: 1 },
    });
    return data.docs[0] ? noticiaParaArtigo(data.docs[0]) : null;
  },
};
