import axios from "axios";
import { API_CONFIG } from "@/lib/constants";
import { useAuthStore } from "@/stores/authStore";

export const strapiClient = axios.create({
  baseURL: API_CONFIG.STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

strapiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
