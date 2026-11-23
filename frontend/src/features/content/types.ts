import type { LexicalState } from "@/types/cms";

/** Artigo como o site exibe (independe do formato do CMS). */
export interface Artigo {
  id: number | string;
  titulo: string;
  slug: string;
  resumo: string;
  categoria: string;
  autor: string;
  tempoLeitura: string;
  publicadoEm: string;
  capaUrl: string | null;
  /** Texto rico vindo do CMS. */
  corpo?: LexicalState | null;
  /** Parágrafos simples do acervo de reserva (quando o CMS não responde). */
  paragrafos?: string[];
  cargo?: string;
}
