import { strapiClient } from "@/lib/clients/strapi-client";
import { StrapiArticle, StrapiResponse } from "@/types/strapi";

/**
 * Serviço que gerencia o consumo de artigos e publicações do Strapi CMS.
 *
 * O Strapi funciona como um painel administrativo onde professores e pesquisadores
 * podem cadastrar ou editar artigos sem precisar mexer em uma única linha de código.
 *
 * COMO FUNCIONA:
 * - 'populate: "*"' pede para o Strapi trazer imagens de capa e autores anexados.
 * - 'sort: "publishedAt:desc"' traz sempre as publicações mais recentes primeiro.
 */
export const strapiContentService = {
  // Busca a lista completa de artigos cadastrados
  async getArtigos(): Promise<StrapiResponse<StrapiArticle[]>> {
    const { data } = await strapiClient.get<StrapiResponse<StrapiArticle[]>>("/api/artigos", {
      params: {
        populate: "*",
        sort: "publishedAt:desc",
      },
    });
    return data;
  },

  // Busca um artigo específico pelo seu 'slug' (endereço legível, ex: 'sobral-1919')
  async getArtigoBySlug(slug: string): Promise<StrapiArticle | null> {
    const { data } = await strapiClient.get<StrapiResponse<StrapiArticle[]>>("/api/artigos", {
      params: {
        "filters[slug][$eq]": slug,
        populate: "*",
      },
    });
    return data.data[0] || null;
  },
};
