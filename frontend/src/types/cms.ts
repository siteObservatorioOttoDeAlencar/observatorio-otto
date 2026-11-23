/** Tipos das respostas REST do Payload CMS usadas pelo site. */

export interface PayloadList<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages: number;
}

export interface PayloadMedia {
  id: number;
  url?: string | null;
  alt?: string | null;
  legenda?: string | null;
  credito?: string | null;
  width?: number | null;
  height?: number | null;
}

/** Texto rico do Payload (Lexical serializado em JSON). */
export interface LexicalNode {
  type: string;
  text?: string;
  format?: number | string;
  tag?: string;
  listType?: "bullet" | "number" | "check";
  url?: string;
  fields?: { url?: string; newTab?: boolean; linkType?: string };
  children?: LexicalNode[];
  [chave: string]: unknown;
}

export interface LexicalState {
  root: LexicalNode;
}

/** Relações vêm como objeto (depth ≥ 1) ou só como id. */
export type Relacao<T> = T | number | null | undefined;

export type CategoriaNoticia =
  | "astrofisica"
  | "historia-da-ciencia"
  | "observacional"
  | "instrumentacao";

export interface NoticiaCms {
  id: number;
  titulo: string;
  slug: string;
  resumo: string;
  categoria?: CategoriaNoticia | null;
  autor?: string | null;
  corpo?: LexicalState | null;
  capa?: Relacao<PayloadMedia>;
  dataPublicacao: string;
  projetoRelacionado?: string | null;
}

export type TipoEvento = "observacao" | "oficina" | "palestra" | "visita";
export type SituacaoEvento = "agendado" | "realizado" | "cancelado";

export interface EventoCms {
  id: number;
  titulo: string;
  tipo: TipoEvento;
  inicio: string;
  fim?: string | null;
  local?: string | null;
  descricao?: LexicalState | null;
  publicoAlvo?: string | null;
  situacao: SituacaoEvento;
  linkInscricao?: string | null;
  fotos?: Relacao<PayloadMedia>[] | null;
  relato?: LexicalState | null;
}

export interface InicioCms {
  titulo?: string | null;
  apresentacao?: LexicalState | null;
  destaques?: Relacao<PayloadMedia>[] | null;
}
