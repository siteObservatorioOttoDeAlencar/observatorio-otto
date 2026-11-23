import { cmsClient } from "@/lib/clients/cms-client";
import { AuthResponse, LoginCredentials } from "@/types/auth";

/**
 * Login no Payload CMS (e-mail + senha). Não existe cadastro público:
 * as contas são criadas por administradores no painel do CMS.
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await cmsClient.post<AuthResponse>("/api/users/login", credentials);
    return data;
  },
};

/** Mensagem legível a partir do erro devolvido pelo CMS. */
export function mensagemDeErroDeLogin(err: unknown): string {
  const e = err as { response?: { data?: { errors?: { message?: string }[] } }; code?: string };
  if (e?.code === "ERR_NETWORK" || e?.code === "ECONNABORTED") {
    return "Não foi possível falar com o servidor. Tente novamente em instantes.";
  }
  return e?.response?.data?.errors?.[0]?.message
    ? "E-mail ou senha incorretos. Verifique suas credenciais."
    : "Não foi possível entrar. Tente novamente.";
}
