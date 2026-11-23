import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { AgendaObservatorio, formatarQuando } from "./AgendaObservatorio";
import type { EventoCms } from "@/types/cms";

const futuro = new Date(Date.now() + 7 * 86400000).toISOString();
const passado = new Date(Date.now() - 7 * 86400000).toISOString();

const evento = (extra: Partial<EventoCms>): EventoCms => ({
  id: 1,
  titulo: "Observação pública de Saturno",
  tipo: "observacao",
  inicio: futuro,
  situacao: "agendado",
  ...extra,
});

describe("AgendaObservatorio", () => {
  it("mostra aviso quando o CMS não respondeu (eventos = null)", () => {
    render(<AgendaObservatorio eventos={null} />);
    expect(screen.getByRole("status")).toHaveTextContent(/temporariamente indisponível/i);
  });

  it("mostra mensagem de agenda vazia quando não há eventos publicados", () => {
    render(<AgendaObservatorio eventos={[]} />);
    expect(screen.getByText(/nenhum evento publicado/i)).toBeInTheDocument();
  });

  it("separa próximos e anteriores e só mostra inscrição de evento agendado", () => {
    render(
      <AgendaObservatorio
        eventos={[
          evento({ id: 1, titulo: "Evento futuro", linkInscricao: "https://exemplo.org/inscricao" }),
          evento({
            id: 2,
            titulo: "Evento passado",
            inicio: passado,
            situacao: "realizado",
            linkInscricao: "https://exemplo.org/antigo",
          }),
          evento({ id: 3, titulo: "Evento cancelado", situacao: "cancelado", linkInscricao: "https://exemplo.org/x" }),
        ]}
      />,
    );
    expect(screen.getByRole("heading", { name: /próximos eventos/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /eventos anteriores/i })).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: /inscrever-se/i });
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "https://exemplo.org/inscricao");
  });

  it("não cria link para endereços perigosos", () => {
    render(<AgendaObservatorio eventos={[evento({ linkInscricao: "javascript:alert(1)" })]} />);
    expect(screen.queryByRole("link", { name: /inscrever-se/i })).toBeNull();
  });
});

describe("formatarQuando", () => {
  it("formata no horário de Fortaleza (UTC-3)", () => {
    // 21:00 UTC = 18:00 em Fortaleza
    expect(formatarQuando("2026-12-05T21:00:00.000Z")).toMatch(/5 de dezembro de 2026, 18:00/);
  });

  it("mostra só a hora final quando termina no mesmo dia", () => {
    expect(formatarQuando("2026-12-05T21:00:00.000Z", "2026-12-05T23:00:00.000Z")).toMatch(/18:00 às 20:00/);
  });

  it("retorna vazio para data inválida", () => {
    expect(formatarQuando("não é data")).toBe("");
  });
});
