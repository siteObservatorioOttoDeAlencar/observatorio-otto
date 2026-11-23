import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import type { ObservarHojeResponse, PlanetaVisivel } from "@/types/astronomy";

const useSkyToday = vi.fn();
vi.mock("@/features/sky-today/hooks/useSkyToday", () => ({ useSkyToday: () => useSkyToday() }));

import { OQueObservarHojeHumanizado, escolherDestaques } from "./OQueObservarHojeHumanizado";

const planeta = (extra: Partial<PlanetaVisivel>): PlanetaVisivel => ({
  nome: "Saturno",
  altitude_graus: 73.5,
  azimute_graus: 262.1,
  direcao_cardeal: "Oeste",
  altura: "alto no céu",
  visivel_a_olho_nu: true,
  nivel_dificuldade: "Fácil",
  equipamento_recomendado: "Apenas seus olhos",
  visibilidade: "Boa",
  destaque_da_noite: false,
  ...extra,
});

const base: ObservarHojeResponse = {
  status: "ok",
  data_hora_utc: "2026-11-23T15:00:00Z",
  calculado_em: "2026-11-23T12:00:00-03:00",
  periodo: "noite",
  planetas_visiveis_agora: [],
  fase_lua_graus: 171.3,
  fase_lua_nome: "Cheia",
  lua: {
    fase_nome: "Cheia",
    fase_graus: 171.3,
    iluminacao_percentual: 99,
    proxima_lua_cheia: "2026-11-24T11:53-03:00",
    proxima_lua_nova: "2026-12-08T21:51-03:00",
    nascer: "16:37",
    por: "A Lua não se põe neste dia.",
  },
  observatorio: { latitude: -3.7793, longitude: -38.5661 },
};

beforeEach(() => {
  useSkyToday.mockReset();
});

describe("OQueObservarHojeHumanizado", () => {
  it("de dia mostra a MSG020, nenhum planeta e a Lua", () => {
    useSkyToday.mockReturnValue({
      isLoading: false,
      data: {
        ...base,
        periodo: "dia",
        mensagem: "Ainda é dia em Fortaleza. Os planetas começam a aparecer depois do pôr do Sol, às 17:29.",
      },
    });
    render(<OQueObservarHojeHumanizado />);
    expect(screen.getByRole("status")).toHaveTextContent(/às 17:29\./);
    expect(screen.queryByText("Saturno")).toBeNull();
    expect(screen.getByRole("heading", { name: "Lua" })).toBeInTheDocument();
    expect(screen.getByText("99% iluminada")).toBeInTheDocument();
  });

  it("à noite mostra direção e altura em linguagem humana e coordenadas no modo técnico", async () => {
    useSkyToday.mockReturnValue({
      isLoading: false,
      data: { ...base, planetas_visiveis_agora: [planeta({ destaque_da_noite: true })] },
    });
    render(<OQueObservarHojeHumanizado />);
    expect(screen.getByRole("heading", { name: "Saturno" })).toBeInTheDocument();
    expect(screen.getByText("Oeste")).toBeInTheDocument();
    expect(screen.getByText("alto no céu")).toBeInTheDocument();
    expect(screen.queryByRole("status")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: /modo técnico/i }));
    expect(screen.getByText("73.5°")).toBeInTheDocument();
    expect(screen.getByText("262.1°")).toBeInTheDocument();
    expect(screen.getByText("171.3°")).toBeInTheDocument();
  });

  it("à noite sem planetas acima do horizonte avisa e ainda mostra a Lua", () => {
    useSkyToday.mockReturnValue({ isLoading: false, data: base });
    render(<OQueObservarHojeHumanizado />);
    expect(screen.getByText(/nenhum dos planetas principais/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Lua" })).toBeInTheDocument();
  });

  it("mostra mensagem de carregamento enquanto não há dados", () => {
    useSkyToday.mockReturnValue({ isLoading: true, data: undefined });
    render(<OQueObservarHojeHumanizado />);
    expect(screen.getByText(/calculando os astros/i)).toBeInTheDocument();
  });
});

describe("escolherDestaques", () => {
  it("prioriza o destaque da noite e depois os mais altos, limitando a 2", () => {
    const lista = [
      planeta({ nome: "Marte", altitude_graus: 20 }),
      planeta({ nome: "Júpiter", altitude_graus: 60 }),
      planeta({ nome: "Vênus", altitude_graus: 10, destaque_da_noite: true }),
    ];
    expect(escolherDestaques(lista).map((p) => p.nome)).toEqual(["Vênus", "Júpiter"]);
  });
});
