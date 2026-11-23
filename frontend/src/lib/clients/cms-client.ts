import axios from "axios";
import { API_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

/**
 * Cliente HTTP do Payload CMS (login e leitura de conteúdo no navegador).
 *
 * O CMS autoriza este site por CORS (variável ALLOWED_ORIGINS do projeto do CMS).
 * Com o usuário logado, o token vai no cabeçalho `Authorization: JWT <token>`,
 * o mesmo formato que a FastAPI repassa ao CMS para validar o login.
 */
export const cmsClient = axios.create({
  baseURL: API_CONFIG.CMS_URL,
  timeout: 6000, // CMS fora do ar → cai no conteúdo de reserva rapidamente
  headers: {
    "Content-Type": "application/json",
  },
});

cmsClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});
