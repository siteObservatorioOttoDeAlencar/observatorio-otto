import { create } from "zustand";
import { StrapiUser } from "@/types/auth";

/**
 * 🎓 GERENCIAMENTO DE ESTADO GLOBAL DE AUTENTICAÇÃO (Zustand)
 * 
 * Por que usamos Zustand aqui?
 * Em aplicações React, compartilhar o estado de "quem está logado" entre componentes distantes
 * (como a Navbar, formulários de envio e botões de ação) sem passar props manualmente (prop drilling)
 * é um desafio clássico.
 * 
 * Zustand é uma biblioteca minimalista de gerenciamento de estado.
 * Ela não exige reducers complexos como o Redux antigo, sendo muito fácil de entender:
 * você define as variáveis que quer guardar e as funções para alterá-las!
 */
interface AuthState {
  token: string | null;
  user: StrapiUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: StrapiUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Estado inicial: usuário deslogado
  token: null,
  user: null,
  isAuthenticated: false,

  // Salva o token emitido pelo Strapi e os dados do usuário após login bem-sucedido
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),

  // Limpa o estado quando o usuário clica em "Sair" na interface
  logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));
