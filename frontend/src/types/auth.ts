/** Perfis definidos no CMS (campo "perfil" dos usuários). */
export type Perfil = "administrador" | "coordenador" | "editor" | "observacao";

/** Usuário devolvido pelo CMS no login. */
export interface CmsUser {
  id: number;
  email: string;
  perfil: Perfil;
}

export interface AuthResponse {
  token: string;
  user: CmsUser;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
