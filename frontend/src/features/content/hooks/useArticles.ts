import { useQuery } from "@tanstack/react-query";
import { cmsContentService } from "../services/cmsContentService";

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => cmsContentService.getArtigos(),
    retry: 1, // CMS fora do ar → a página cai logo no acervo de reserva
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => cmsContentService.getArtigoBySlug(slug),
    enabled: !!slug,
    retry: 1,
  });
}
