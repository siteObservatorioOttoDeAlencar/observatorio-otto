export const OBSERVATORIO_CONFIG = {
  NOME: "Observatório Digital Otto de Alencar",
  CIDADE: "Fortaleza",
  ESTADO: "CE",
  PAIS: "Brasil",
  LATITUDE: parseFloat(process.env.NEXT_PUBLIC_OBSERVATORIO_LAT || "-3.7793"),
  LONGITUDE: parseFloat(process.env.NEXT_PUBLIC_OBSERVATORIO_LON || "-38.5661"),
};

// URLs dos dois backends. Em produção vêm das variáveis de ambiente do projeto na Vercel;
// sem elas, valem os endereços do ambiente de desenvolvimento local.
const semBarraFinal = (url: string) => url.replace(/\/+$/, "");

export const API_CONFIG = {
  /** FastAPI (efemérides e registros de observação). */
  API_URL: semBarraFinal(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"),
  /** Payload CMS (conteúdo editorial e login). */
  CMS_URL: semBarraFinal(process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000"),
};
