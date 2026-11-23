import { API_CONFIG } from "@/lib/constants";

/**
 * Leitura do CMS em componentes de servidor (ISR).
 *
 * Nunca lança erro: se o CMS estiver fora do ar, lento ou devolver erro, retorna
 * `null` e quem chamou exibe o conteúdo de reserva. O resultado é revalidado
 * a cada `revalidar` segundos.
 */
export async function lerDoCms<T>(caminho: string, revalidar = 60): Promise<T | null> {
  try {
    const resposta = await fetch(`${API_CONFIG.CMS_URL}${caminho}`, {
      next: { revalidate: revalidar },
      signal: AbortSignal.timeout(5000),
    });
    if (!resposta.ok) return null;
    return (await resposta.json()) as T;
  } catch {
    return null;
  }
}
