"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useCreateObservation } from "@/features/observations/hooks/useCreateObservation";
import { ObservationForm } from "@/features/observations/components/ObservationForm";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";

export default function NovoRegistroPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { mutateAsync: criarRegistro, isPending, error } = useCreateObservation();
  const [success, setSuccess] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const objeto_celeste = formData.get("objeto_celeste") as string;
    const equipamento_utilizado = (formData.get("equipamento_utilizado") as string) || "";
    const anotacoes = formData.get("anotacoes") as string;

    if (!objeto_celeste || !anotacoes) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await criarRegistro({
        objeto_celeste,
        equipamento_utilizado,
        anotacoes,
        data_hora: new Date().toISOString(),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/registros");
      }, 1500);
    } catch (err: any) {
      setFormError(
        err?.response?.data?.detail ||
          "Não foi possível registrar a observação no servidor FastAPI. Verifique a autenticação."
      );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <div className="cosmic-glass rounded-2xl p-8 border border-space-border/80 space-y-4">
          <AlertCircle className="h-10 w-10 text-stellar-amber mx-auto" />
          <h2 className="font-display text-xl font-bold text-lunar-silver">
            Autenticação Necessária
          </h2>
          <p className="text-xs text-space-text-muted">
            Você precisa estar autenticado com sua credencial Strapi para submeter registros astronômicos.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/auth/login">
              <Button variant="primary" size="sm">
                Fazer Login
              </Button>
            </Link>
            <Link href="/auth/cadastro">
              <Button variant="outline" size="sm">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/registros"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-space-text-muted hover:text-nebula-cyan transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Voltar ao Mural de Registros</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-wider text-nebula-cyan">
          FastAPI Protected Endpoint
        </span>
      </div>

      <div className="border-b border-space-border/60 pb-4">
        <div className="flex items-center gap-2 text-nebula-cyan mb-1">
          <Sparkles className="h-4 w-4" />
          <span className="text-xs font-mono uppercase tracking-wider">Diário de Bordo</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-lunar-silver">
          Novo Registro de Observação
        </h1>
        <p className="text-xs sm:text-sm text-space-text-muted mt-1">
          Catalogação de sessão telescópica com carimbo de data/hora oficial do Observatório Otto de Alencar.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-3 rounded-xl border border-aurora-green/40 bg-aurora-green/10 p-4 text-sm text-aurora-green animate-in fade-in">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-medium">Registro astronômico catalogado com sucesso!</p>
            <p className="text-xs opacity-80">Redirecionando para o mural de observações...</p>
          </div>
        </div>
      )}

      {formError && (
        <div className="flex items-center gap-3 rounded-xl border border-crimson-deep/40 bg-crimson-deep/10 p-4 text-sm text-crimson-deep">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{formError}</p>
        </div>
      )}

      <div className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80">
        <ObservationForm onSubmit={handleSubmit} isLoading={isPending} />
      </div>
    </div>
  );
}
