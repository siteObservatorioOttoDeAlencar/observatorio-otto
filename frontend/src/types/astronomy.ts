export interface PlanetaVisivel {
  nome: string;
  altitude_graus: number;
  azimute_graus: number;
  /** RN004: "perto do horizonte", "a meia altura", "alto no céu" ou "quase acima da cabeça". */
  altura?: string;
  // Campos aditivos e humanos fornecidos pelo backend enriquecido
  direcao_cardeal?: string;
  visivel_a_olho_nu?: boolean;
  nivel_dificuldade?: string;
  equipamento_recomendado?: string;
  // Novos campos de conveniência prontos para a interface
  categoria_observacao?: string;
  visibilidade?: "Excelente" | "Boa" | "Moderada" | "Baixa" | string;
  destaque_da_noite?: boolean;
}

export interface ObservatorioCoords {
  latitude: number;
  longitude: number;
}

/** RN002: 8 fases (Nova, Crescente, Quarto crescente, Crescente gibosa, Cheia, Minguante gibosa, Quarto minguante, Minguante). */
export type FaseLuaNome =
  | "Nova"
  | "Crescente"
  | "Quarto crescente"
  | "Crescente gibosa"
  | "Cheia"
  | "Minguante gibosa"
  | "Quarto minguante"
  | "Minguante"
  | string;

export interface LuaInfo {
  fase_nome: FaseLuaNome;
  fase_graus: number;
  iluminacao_percentual: number;
  /** ISO 8601 no fuso de Fortaleza. */
  proxima_lua_cheia?: string | null;
  proxima_lua_nova?: string | null;
  /** "HH:MM" no fuso de Fortaleza, ou o aviso "A Lua não nasce neste dia." */
  nascer: string;
  por: string;
  nascer_iso?: string | null;
  por_iso?: string | null;
}

export interface SolInfo {
  altitude_graus: number;
  nascer: string;
  por: string;
  nascer_iso?: string | null;
  por_iso?: string | null;
}

export interface CondicoesGerais {
  status: "favoravel" | "regular" | "dia" | string;
  mensagem: string;
  melhor_horario?: string;
}

export interface ObservarHojeResponse {
  status?: "ok" | "degraded" | string;
  /** Data e hora do cálculo no fuso de Fortaleza (ISO 8601 com -03:00). */
  calculado_em?: string;
  fuso?: string;
  data_hora_utc: string;
  /** "dia": nenhum planeta é listado e `mensagem` explica quando eles aparecem. */
  periodo?: "dia" | "noite";
  mensagem?: string;
  melhor_horario?: string;
  planetas_visiveis_agora: PlanetaVisivel[];
  fase_lua_graus: number;
  fase_lua_nome: FaseLuaNome;
  lua?: LuaInfo;
  sol?: SolInfo;
  condicoes_gerais?: CondicoesGerais;
  observatorio: ObservatorioCoords;
}
