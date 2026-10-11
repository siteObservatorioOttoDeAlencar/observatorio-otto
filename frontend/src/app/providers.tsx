"use client";

import * as React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createQueryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

/**
 * 🎓 PROVEDORES GLOBAIS DA APLICAÇÃO (Providers)
 * 
 * Por que este arquivo existe?
 * No Next.js (App Router), o arquivo raiz `layout.tsx` é um Server Component por padrão.
 * No entanto, bibliotecas como TanStack React Query (cache de dados assíncronos) e 
 * ThemeProvider (tema escuro/claro) precisam do ciclo de vida do cliente (hooks, state, contexto).
 * 
 * Encapsulando tudo neste componente marcado com "use client", nós mantemos o layout raiz
 * limpo e fornecemos os contextos necessários para toda a árvore de componentes da aplicação!
 */
export function Providers({ children }: { children: React.ReactNode }) {
  /**
   * 💡 Dica didática para iniciantes:
   * Por que usar `React.useState(() => createQueryClient())` em vez de criar fora do componente?
   * Se criássemos `const queryClient = new QueryClient()` fora da função, a mesma instância
   * seria compartilhada entre diferentes usuários/requisições no servidor durante o SSR,
   * o que causaria vazamento de dados de cache entre sessões.
   * Usando useState com função inicializadora, garantimos exatamente UMA instância isolada por sessão de usuário!
   */
  const [queryClient] = React.useState(() => createQueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="observatorio-theme-preference"
    >
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Devtools: painel flutuante que ajuda a inspecionar o estado das queries (visível em dev) */}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
