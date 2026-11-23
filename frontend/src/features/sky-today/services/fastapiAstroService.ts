import { fastapiClient } from "@/lib/clients/fastapi-client";
import { ObservarHojeResponse } from "@/types/astronomy";

// Conteúdo de reserva: só aparece se a API não responder. `status: "fallback"` identifica esse caso.
const FALLBACK_ASTRO: ObservarHojeResponse = {
  status: "fallback",
  data_hora_utc: new Date().toISOString(),
  planetas_visiveis_agora: [
    { nome: "Vênus", altitude_graus: 28.4, azimute_graus: 255.1 },
    { nome: "Júpiter", altitude_graus: 52.8, azimute_graus: 78.4 },
    { nome: "Saturno", altitude_graus: 44.2, azimute_graus: 105.6 },
    { nome: "Marte", altitude_graus: 18.5, azimute_graus: 84.2 },
  ],
  fase_lua_graus: 124.5,
  fase_lua_nome: "Crescente gibosa", // 124,5° cai na faixa [112,5–157,5) da RN002
  observatorio: { latitude: -3.7793, longitude: -38.5661 },
};

/**
 * Este serviço centraliza as chamadas para a API FastAPI de astronomia.
 *
 * Ele busca os dados de efemérides (planetas visíveis, fase da lua, etc.)
 * calculados para as coordenadas geográficas do observatório em Fortaleza.
 *
 * PONTO DE ATENÇÃO PARA INICIANTES:
 * Caso o backend em Python (FastAPI na porta 8000) esteja desligado durante o
 * desenvolvimento, a função captura o erro suavemente (try/catch) e retorna
 * os dados seguros de fallback (FALLBACK_ASTRO). Assim, a tela nunca quebra!
 */
export const fastapiAstroService = {
  /**
   * @param dataHora opcional, ISO 8601 (ex.: "2026-12-05T21:00:00-03:00"): calcula nesse momento em
   * vez de agora. A API aceita até 1 ano antes ou depois de hoje (fora disso responde 422).
   */
  async getObservarHoje(dataHora?: string): Promise<ObservarHojeResponse> {
    try {
      // Faz uma requisição GET para o endpoint '/observar-hoje'
      const { data } = await fastapiClient.get<ObservarHojeResponse>("/observar-hoje", {
        params: dataHora ? { data_hora: dataHora } : undefined,
        timeout: 5000, // Se demorar mais de 5s (ex.: partida a frio da função), cai no fallback
      });
      return data;
    } catch {
      // Retorna dados astronômicos padrão caso o backend esteja offline
      return FALLBACK_ASTRO;
    }
  },
};
