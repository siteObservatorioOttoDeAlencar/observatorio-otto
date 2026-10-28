export interface PlanetaVisivel {
  nome: string;
  altitude_graus: number;
  azimute_graus: number;
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

export type FaseLuaNome = "Nova" | "Crescente" | "Cheia" | "Minguante" | string;

export interface CondicoesGerais {
  status: "favoravel" | "regular" | string;
  mensagem: string;
  melhor_horario?: string;
}

export interface ObservarHojeResponse {
  status?: "ok" | "degraded" | string;
  data_hora_utc: string;
  melhor_horario?: string;
  planetas_visiveis_agora: PlanetaVisivel[];
  fase_lua_graus: number;
  fase_lua_nome: FaseLuaNome;
  condicoes_gerais?: CondicoesGerais;
  observatorio: ObservatorioCoords;
}
