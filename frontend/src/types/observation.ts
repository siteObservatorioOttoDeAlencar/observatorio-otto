export interface RegistroObservacaoInput {
  objeto_celeste: string;
  data_hora: string;
  altitude_graus?: number;
  azimute_graus?: number;
  equipamento_utilizado?: string;
  condicoes_climaticas?: string;
  anotacoes: string;
  imagem_url?: string;
}

export interface RegistroObservacao extends RegistroObservacaoInput {
  id: string | number;
  usuario_id: number;
  createdAt: string;
}
