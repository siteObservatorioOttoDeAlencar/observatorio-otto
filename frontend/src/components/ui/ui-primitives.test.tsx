import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

describe("[Unit] Primitivas de UI (Button, Badge, Input)", () => {
  it("deve renderizar botão com variantes cósmicas e disparar clique", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} variant="primary">Explorar Céu</Button>);

    const btn = screen.getByRole("button", { name: /explorar céu/i });
    expect(btn).toBeInTheDocument();
    await userEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("deve desabilitar e indicar carregamento quando isLoading for verdadeiro", () => {
    render(<Button isLoading>Processando</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(screen.getByText(/processando/i)).toBeInTheDocument();
  });

  it("deve renderizar Badge com variante de visibilidade", () => {
    render(<Badge variant="visible">Visível Agora</Badge>);
    expect(screen.getByText(/visível agora/i)).toHaveClass("text-aurora-green");
  });

  it("deve vincular mensagem de erro acessível no Input via aria-describedby", () => {
    render(<Input label="Equipamento" error="Campo obrigatório" id="campo-teste" />);
    const input = screen.getByLabelText(/equipamento/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "campo-teste-error");
    expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
  });
});
