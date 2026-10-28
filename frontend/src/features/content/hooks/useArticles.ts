import { useQuery } from "@tanstack/react-query";
import { strapiContentService } from "../services/strapiContentService";

export function useArticles() {
  return useQuery({
    queryKey: ["articles"],
    queryFn: () => strapiContentService.getArtigos(),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => strapiContentService.getArtigoBySlug(slug),
    enabled: !!slug,
  });
}
