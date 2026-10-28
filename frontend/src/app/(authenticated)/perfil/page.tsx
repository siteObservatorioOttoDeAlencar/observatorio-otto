"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShieldCheck,
  Telescope,
  Calendar,
  Key,
  LogOut,
  PlusCircle,
  Sparkles,
  Eye,
  Award,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PerfilPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="cosmic-glass rounded-2xl p-8 border border-space-border/80 space-y-4">
          <User className="h-12 w-12 text-nebula-cyan mx-auto opacity-70" />
          <h2 className="font-display text-xl font-bold text-lunar-silver">
            Nenhuma Sessão Ativa
          </h2>
          <p className="text-xs text-space-text-muted">
            Faça login com sua conta Strapi para visualizar seu perfil astronômico e gerenciar seus diários.
          </p>
          <div className="pt-2">
            <Link href="/auth/login">
              <Button variant="primary" className="w-full">
                Entrar no Observatório
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Cabeçalho do Perfil */}
      <div className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-space-surface-2 border border-nebula-cyan/30 text-nebula-cyan shadow-cosmic-md">
            <User className="h-8 w-8 sm:h-10 sm:w-10 cosmic-glow" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-aurora-green"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-lunar-silver">
                {user.username}
              </h1>
              <Badge variant="visible">Ativo</Badge>
            </div>
            <p className="text-xs font-mono text-space-text-muted mt-0.5">
              {user.email}
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-space-text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-aurora-green" />
              <span>Autenticado via Strapi JWT v4/v5</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/registros/novo">
            <Button variant="primary" size="sm" className="gap-2 shadow-cosmic-sm">
              <PlusCircle className="h-4 w-4" />
              <span>Novo Registro</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 text-crimson-deep hover:bg-crimson-deep/10 border-crimson-deep/30"
          >
            <LogOut className="h-4 w-4" />
            <span>Encerrar Sessão</span>
          </Button>
        </div>
      </div>

      {/* Cartões de Estatísticas / Telemetria do Observador */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
          <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
            Registros Totais
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-nebula-cyan">
              12
            </span>
            <span className="text-xs text-space-text-muted">sessões</span>
          </div>
        </div>

        <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
          <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
            Alvos Catalogados
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-bold text-stellar-amber">
              7
            </span>
            <span className="text-xs text-space-text-muted">objetos</span>
          </div>
        </div>

        <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
          <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
            Nível Científico
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl sm:text-2xl font-bold text-lunar-silver">
              Observador III
            </span>
          </div>
        </div>

        <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
          <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
            Base de Operação
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs sm:text-sm font-medium text-lunar-silver truncate">
              Fortaleza / CE
            </span>
          </div>
        </div>
      </div>

      {/* Seção de Credencial Criptográfica e Segurança */}
      <div className="cosmic-glass rounded-2xl p-6 border border-space-border/80 space-y-4">
        <div className="flex items-center gap-2 text-lunar-silver font-display font-semibold">
          <Key className="h-5 w-5 text-nebula-cyan" />
          <span>Sessão Criptográfica Ativa (Dual Backend Bridge)</span>
        </div>

        <p className="text-xs text-space-text-muted">
          Seu token de acesso assinado pelo Strapi é transmitido com segurança via cabeçalho HTTP Bearer
          para validar requisições protegidas na API FastAPI do observatório.
        </p>

        <div className="rounded-xl bg-space-surface-2 p-3 font-mono text-[11px] text-space-text-muted break-all border border-space-border/60">
          <span className="text-nebula-cyan">Bearer JWT:</span> {token ? `${token.substring(0, 36)}...` : "Não disponível"}
        </div>
      </div>
    </div>
  );
}
