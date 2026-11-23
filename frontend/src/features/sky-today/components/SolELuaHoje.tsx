import * as React from "react";
import { Moon, Sun, Sunrise, Sunset } from "lucide-react";
import type { ObservarHojeResponse } from "@/types/astronomy";

const FUSO = "America/Fortaleza";

/** "05/12, 06:15" no horário de Fortaleza (ou "—" se não houver data). */
export function formatarDataLocal(iso?: string | null): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUSO,
  }).format(data);
}

/** Nascer/pôr do Sol e da Lua do dia e próximas luas cheia e nova (US034, RN002). */
export function SolELuaHoje({ data }: { data: ObservarHojeResponse }) {
  const { sol, lua } = data;
  if (!sol && !lua) return null;

  return (
    <div
      aria-label="Sol e Lua hoje"
      className="grid grid-cols-2 gap-4 text-xs font-mono pt-3 border-t border-space-border/60"
    >
      {sol && (
        <div className="space-y-1">
          <span className="text-space-text-muted flex items-center gap-1.5">
            <Sun className="h-3.5 w-3.5 text-stellar-amber" /> Sol (Fortaleza)
          </span>
          <div className="text-lunar-silver flex items-center gap-1.5">
            <Sunrise className="h-3.5 w-3.5" /> Nasce: <strong>{sol.nascer}</strong>
          </div>
          <div className="text-lunar-silver flex items-center gap-1.5">
            <Sunset className="h-3.5 w-3.5" /> Põe-se: <strong>{sol.por}</strong>
          </div>
        </div>
      )}
      {lua && (
        <div className="space-y-1">
          <span className="text-space-text-muted flex items-center gap-1.5">
            <Moon className="h-3.5 w-3.5 text-stellar-amber" /> Lua (Fortaleza)
          </span>
          <div className="text-lunar-silver">
            Nasce: <strong>{lua.nascer}</strong>
          </div>
          <div className="text-lunar-silver">
            Põe-se: <strong>{lua.por}</strong>
          </div>
        </div>
      )}
      {lua && (
        <div className="col-span-2 grid grid-cols-2 gap-4 pt-2 border-t border-space-border/40">
          <div>
            <span className="text-space-text-muted block">Próxima Lua cheia:</span>
            <span className="text-lunar-silver">{formatarDataLocal(lua.proxima_lua_cheia)}</span>
          </div>
          <div>
            <span className="text-space-text-muted block">Próxima Lua nova:</span>
            <span className="text-lunar-silver">{formatarDataLocal(lua.proxima_lua_nova)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
