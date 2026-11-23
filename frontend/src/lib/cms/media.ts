import { API_CONFIG } from "@/lib/constants";
import type { PayloadMedia, Relacao } from "@/types/cms";

/** Uma relação só é utilizável quando foi populada (objeto, não apenas o id). */
export function midiaPopulada(m: Relacao<PayloadMedia>): PayloadMedia | null {
  return m && typeof m === "object" ? m : null;
}

/**
 * Endereço absoluto da mídia. No Vercel Blob a URL já vem completa;
 * no desenvolvimento local o CMS devolve um caminho relativo (/api/media/file/...).
 */
export function urlDaMidia(m: Relacao<PayloadMedia>): string | null {
  const midia = midiaPopulada(m);
  if (!midia?.url) return null;
  return /^https?:\/\//i.test(midia.url) ? midia.url : `${API_CONFIG.CMS_URL}${midia.url}`;
}
