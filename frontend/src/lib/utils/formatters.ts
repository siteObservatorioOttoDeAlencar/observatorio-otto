import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(isoString: string): string {
  try {
    const date = parseISO(isoString);
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return isoString;
  }
}

export function formatCoordinates(degrees: number, type: "altitude" | "azimute"): string {
  const prefix = type === "altitude" ? (degrees >= 0 ? "+" : "") : "";
  return `${prefix}${degrees.toFixed(1)}°`;
}
