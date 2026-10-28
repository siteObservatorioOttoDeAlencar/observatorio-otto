import axios from "axios";
import { API_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

/**
 * 🎓 CLIENTE HTTP PARA FASTAPI (Axios Instance)
 * 
 * Por que este arquivo existe?
 * Em vez de chamar `axios.get("http://localhost:8000/...")` em várias partes do projeto,
 * nós criamos uma instância única centralizada.
 * 
 * Vantagens didáticas:
 * 1. Base URL padronizada (vem de variáveis de ambiente configuradas em `API_CONFIG`).
 * 2. Headers padrão (JSON).
 * 3. Interceptors automáticos (adiciona o token JWT do usuário automaticamente em qualquer requisição autenticada).
 */
export const fastapiClient = axios.create({
  baseURL: API_CONFIG.FASTAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 💡 Como funciona o Interceptor de Requisição:
 * Antes de CADA requisição sair do navegador para o backend FastAPI,
 * este interceptor "escuta" a chamada e verifica se o usuário está logado
 * na store global Zustand (`useAuthStore`).
 * 
 * Se houver um token válido (emitido pelo Strapi), ele injeta o cabeçalho:
 * `Authorization: Bearer <seu_token>`
 * 
 * Dessa forma, você nunca precisa passar o token manualmente nas chamadas da API!
 */
fastapiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
