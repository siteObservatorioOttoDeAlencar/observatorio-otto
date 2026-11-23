import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ObservationForm } from "@/features/observations/components/ObservationForm";

describe("[Integration] Formulários Técnicos e Submissão (Auth & Observations)", () => {
  it("deve submeter credenciais de login com e-mail e senha", async () => {
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(<LoginForm onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByPlaceholderText(/astronomo@observatorio.ce/i), "astronomo@observatorio.ce");
    await userEvent.type(screen.getByPlaceholderText(/••••••••/i), "senhaForte123");
    
    await userEvent.click(screen.getByRole("button", { name: /acessar observatório/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("deve preencher e submeter registro técnico de observação", async () => {
    const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(<ObservationForm onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByPlaceholderText(/ex: júpiter/i), "Saturno");
    await userEvent.type(screen.getByPlaceholderText(/ex: telescópio/i), "Celestron 8 SE");
    await userEvent.type(screen.getByPlaceholderText(/descreva a nitidez/i), "Visão clara da divisão de Cassini");

    await userEvent.click(screen.getByRole("button", { name: /salvar registro no observatório/i }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
