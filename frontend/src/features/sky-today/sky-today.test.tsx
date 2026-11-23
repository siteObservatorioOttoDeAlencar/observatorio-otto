import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import type { ObservarHojeResponse } from "@/types/astronomy";

const get = vi.fn();
vi.mock("@/lib/clients/fastapi-client", () => ({ fastapiClient: { get: (...args: unknown[]) => get(...args) } }));

import { fastapiAstroService } from "./services/fastapiAstroService";
import { SolELuaHoje, formatarDataLocal } from "./components/SolELuaHoje";

const resposta: ObservarHojeResponse = {
  status: "ok",
  data_hora_utc: "2026-11-23T15:00:00Z",
  planetas_visiveis_agora: [],
  fase_lua_graus: 10,
  fase_lua_nome: "Nova",
  sol: { altitude_graus: 70, nascer: "05:11", por: "17:29" },
  lua: {
    fase_nome: "Nova",
    fase_graus: 10,
    iluminacao_percentual: 1,
    proxima_lua_cheia: "2026-12-04T05:14-03:00",
    proxima_lua_nova: null,
    nascer: "A Lua não nasce neste dia.",
    por: "16:20",
  },
  observatorio: { latitude: -3.7793, longitude: -38.5661 },
};

beforeEach(() => {
  get.mockReset();
});

describe("fastapiAstroService.getObservarHoje", () => {
  it("devolve a resposta da API sem parâmetro de data", async () => {
    get.mockResolvedValue({ data: resposta });
    expect(await fastapiAstroService.getObservarHoje()).toBe(resposta);
    expect(get).toHaveBeenCalledWith("/observar-hoje", expect.objectContaining({ params: undefined }));
  });

  it("envia data_hora quando informada (US035)", async () => {
    get.mockResolvedValue({ data: resposta });
    await fastapiAstroService.getObservarHoje("2026-12-05T21:00:00-03:00");
    expect(get).toHaveBeenCalledWith(
      "/observar-hoje",
      expect.objectContaining({ params: { data_hora: "2026-12-05T21:00:00-03:00" } }),
    );
  });

  it("usa o conteúdo de reserva quando a API não responde", async () => {
    get.mockImplementation(() => Promise.reject(new Error("timeout")));
    const r = await fastapiAstroService.getObservarHoje();
    expect(r.status).toBe("fallback");
    expect(r.planetas_visiveis_agora.length).toBeGreaterThan(0);
    expect(r.fase_lua_nome).toBe("Crescente gibosa");
  });

  it("usa o conteúdo de reserva quando a API recusa a data (422)", async () => {
    get.mockImplementation(() => Promise.reject({ response: { status: 422 } }));
    expect((await fastapiAstroService.getObservarHoje("2030-01-01T00:00:00-03:00")).status).toBe("fallback");
  });
});

describe("SolELuaHoje", () => {
  it("mostra nascer/pôr do Sol e da Lua, incluindo o aviso de Lua que não nasce", () => {
    render(<SolELuaHoje data={resposta} />);
    expect(screen.getByText("05:11")).toBeInTheDocument();
    expect(screen.getByText("17:29")).toBeInTheDocument();
    expect(screen.getByText("A Lua não nasce neste dia.")).toBeInTheDocument();
    expect(screen.getByText("16:20")).toBeInTheDocument();
  });

  it("formata as próximas fases no horário de Fortaleza", () => {
    expect(formatarDataLocal("2026-12-04T05:14-03:00")).toBe("04/12, 05:14");
    expect(formatarDataLocal(null)).toBe("—");
    expect(formatarDataLocal("lixo")).toBe("—");
  });
});
