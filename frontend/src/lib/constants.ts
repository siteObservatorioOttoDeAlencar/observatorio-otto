export const OBSERVATORIO_CONFIG = {
  NOME: "Observatório Digital Otto de Alencar",
  CIDADE: "Fortaleza",
  ESTADO: "CE",
  PAIS: "Brasil",
  LATITUDE: parseFloat(process.env.NEXT_PUBLIC_OBSERVATORIO_LAT || "-3.7793"),
  LONGITUDE: parseFloat(process.env.NEXT_PUBLIC_OBSERVATORIO_LON || "-38.5661"),
};

export const API_CONFIG = {
  FASTAPI_URL: process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000",
  STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337",
};
