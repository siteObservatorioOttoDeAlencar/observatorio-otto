import { useQuery } from "@tanstack/react-query";
import { fastapiAstroService } from "../services/fastapiAstroService";

/**
 * Hook customizado para consumir os dados do céu de hoje.
 *
 * FLUXO DE DADOS:
 * Componente React → useSkyToday (TanStack Query) → fastapiAstroService → FastAPI Backend
 *
 * VANTAGENS:
 * 1. Faz cache automático dos dados por 5 minutos (staleTime), evitando sobrecarregar o backend.
 * 2. Disponibiliza estados prontos de 'data', 'isLoading' e 'isError'.
 */
export function useSkyToday() {
  return useQuery({
    queryKey: ["sky-today"],
    queryFn: () => fastapiAstroService.getObservarHoje(),
    staleTime: 1000 * 60 * 5, // 5 minutos de cache em memória
  });
}
