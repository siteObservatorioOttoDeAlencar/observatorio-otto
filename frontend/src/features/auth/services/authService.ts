import { strapiClient } from "@/lib/clients/strapi-client";
import { AuthResponse, LoginCredentials, RegisterCredentials } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await strapiClient.post<AuthResponse>("/api/auth/local", credentials);
    return data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const { data } = await strapiClient.post<AuthResponse>("/api/auth/local/register", credentials);
    return data;
  },
};
