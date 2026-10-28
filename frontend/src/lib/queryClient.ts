import { QueryClient, QueryCache, MutationCache } from "@tanstack/react-query";

/**
 * Tratamento global de erros da camada de rede e cache
 */
function handleGlobalError(error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    // Log estruturado em desenvolvimento sem poluir produção
    console.error("[React Query Global Error]:", error);
  }
}

/**
 * Criação da instância singleton ou per-request do QueryClient
 * Configurada com estratégias estritas de caching para observações e efemérides
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleGlobalError(error),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleGlobalError(error),
    }),
    defaultOptions: {
      queries: {
        // Dados astronômicos e notícias mantêm-se 'fresh' por 2 minutos
        staleTime: 1000 * 60 * 2,
        // Mantém cache em memória por 10 minutos antes de garbage collection
        gcTime: 1000 * 60 * 10,
        // Retry inteligente: tenta até 2 vezes, mas não repete erros 4xx de cliente
        retry: (failureCount, error: any) => {
          if (error?.response?.status >= 400 && error?.response?.status < 500) {
            return false;
          }
          return failureCount < 2;
        },
        // Evita chamadas desnecessárias na FastAPI ao trocar de aba no navegador
        refetchOnWindowFocus: false,
        // Revalida se a conexão com a internet cair e voltar
        refetchOnReconnect: true,
      },
      mutations: {
        // Não repete mutações (ex: criação de registros duplicados)
        retry: false,
      },
    },
  });
}
