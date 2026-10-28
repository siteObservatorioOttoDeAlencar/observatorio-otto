import { useMutation } from "@tanstack/react-query";
import { observationService } from "../services/observationService";
import { RegistroObservacaoInput } from "@/types/observation";

export function useCreateObservation() {
  return useMutation({
    mutationFn: (payload: RegistroObservacaoInput) =>
      observationService.criarRegistro(payload),
  });
}
