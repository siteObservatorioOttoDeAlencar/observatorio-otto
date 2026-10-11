import { fastapiClient } from "@/lib/clients/fastapi-client";
import { RegistroObservacao, RegistroObservacaoInput } from "@/types/observation";

export const observationService = {
  async criarRegistro(payload: RegistroObservacaoInput): Promise<RegistroObservacao> {
    const { data } = await fastapiClient.post<RegistroObservacao>("/registros-observacao", payload);
    return data;
  },
};
