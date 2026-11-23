"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Telescope, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { mensagemDeErroDeLogin } from "@/features/auth/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;

    if (!email || !password) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    try {
      await login({ email, password });
      router.push("/perfil");
    } catch (err: unknown) {
      setErrorMessage(mensagemDeErroDeLogin(err));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-space-text-muted hover:text-nebula-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar à Capa</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-wider text-space-text-muted">
          Login via CMS
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-space-surface-2 border border-space-border/80 text-nebula-cyan mb-1">
          <Telescope className="h-6 w-6 cosmic-glow" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-lunar-silver">
          Acesso ao Observatório
        </h1>
        <p className="text-xs text-space-text-muted">
          Entre com seu e-mail e senha para registrar sessões de observação
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-crimson-deep/40 bg-crimson-deep/10 p-3 text-xs text-crimson-deep">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />

      <div className="text-center pt-2 border-t border-space-border/60">
        <p className="text-xs text-space-text-muted">
          Para ter acesso, solicite a um administrador.
        </p>
      </div>
    </div>
  );
}
