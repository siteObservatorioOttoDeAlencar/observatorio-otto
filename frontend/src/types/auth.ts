export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: StrapiUser;
}

export interface LoginCredentials {
  identifier: string; // e-mail ou username no Strapi
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}
