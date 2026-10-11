"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CadastroPage() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const username = (formData.get("username") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!username || !email || !password) {
      setErrorMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas informadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    try {
      await register({ username, email, password });
      router.push("/perfil");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        "Não foi possível concluir o registro. Verifique se o e-mail ou nome já estão em uso.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-space-text-muted hover:text-nebula-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao Login</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-wider text-space-text-muted">
          Novo Observador
        </span>
      </div>

      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-space-surface-2 border border-space-border/80 text-nebula-cyan mb-1">
          <Sparkles className="h-6 w-6 cosmic-glow" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-lunar-silver">
          Registro de Observador
        </h1>
        <p className="text-xs text-space-text-muted">
          Cadastre sua conta para submeter logs científicos e fotos ao Observatório
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-crimson-deep/40 bg-crimson-deep/10 p-3 text-xs text-crimson-deep">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-space-text-muted mb-1 block">
            Nome de Usuário / Indicativo Astronômico
          </label>
          <Input
            name="username"
            type="text"
            placeholder="Ex: galileo_ce"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-space-text-muted mb-1 block">
            E-mail Institucional ou Pessoal
          </label>
          <Input
            name="email"
            type="email"
            placeholder="astronomo@observatorio.ce"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-space-text-muted mb-1 block">
            Senha de Acesso
          </label>
          <Input
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-space-text-muted mb-1 block">
            Confirmar Senha
          </label>
          <Input
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isRegistering}>
          Concluir Cadastro
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-space-border/60">
        <p className="text-xs text-space-text-muted">
          Já possui registro no observatório?{" "}
          <Link
            href="/auth/login"
            className="text-nebula-cyan hover:underline font-medium ml-1"
          >
            Acessar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
