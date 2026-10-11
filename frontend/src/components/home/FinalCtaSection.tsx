"use client";

import * as React from "react";
import Link from "next/link";
import { Telescope, Mail, Sparkles, Send, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function FinalCtaSection() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden border-t border-space-border/50">
      {/* Background com iluminação estelar e gradiente profundo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-space-background via-space-surface-1/60 to-space-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-nebula-cyan/15 via-stellar-amber/10 to-transparent blur-[160px] pointer-events-none" />
      </div>

      <Container size="default">
        <div className="cosmic-glass rounded-3xl p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-nebula-cyan/20 shadow-glow-cyan max-w-5xl mx-auto">
          {/* Ícone em destaque cósmico */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-space-surface-2 border border-nebula-cyan/30 text-nebula-cyan mb-8 shadow-cosmic cosmic-glow">
            <Telescope className="h-8 w-8" />
          </div>

          <div className="max-w-3xl mx-auto space-y-4 mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan block">
              Comunidade de Astrônomos e Observadores
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-lunar-silver leading-tight">
              Faça Parte da Próxima Descoberta Celeste
            </h2>
            <p className="text-space-text-muted text-sm sm:text-lg leading-relaxed text-balance">
              Cadastre-se para receber o boletim semanal com as melhores janelas de observação em Fortaleza, avisos de trânsitos de meteoros e convites para noites de céu aberto.
            </p>
          </div>

          {/* Formulário de Conversão e Inscrição */}
          <div className="max-w-md mx-auto">
            {submitted ? (
              <div className="flex items-center justify-center gap-2.5 p-4 rounded-xl cosmic-glass border border-aurora-green/40 text-aurora-green font-medium text-sm animate-in fade-in">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Inscrição confirmada! Boas observações.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu e-mail de pesquisador ou entusiasta"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-space-surface-2/80 border-space-border/80 focus:border-nebula-cyan"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="h-12 gap-2 whitespace-nowrap shadow-glow-cyan font-semibold px-6 shrink-0"
                >
                  <Send className="h-4 w-4" />
                  Inscrever-se
                </Button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-space-text-muted">
              Sem spam. Apenas ciência, dados de efemérides e fotos do espaço profundo.
            </p>
          </div>

          {/* Atalhos Secundários para Visita e Cadastro */}
          <div className="mt-12 pt-8 border-t border-space-border/40 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-space-text-muted">
            <Link href="/sobre" className="hover:text-nebula-cyan transition-colors">
              Agendar Visita ao Observatório →
            </Link>
            <span className="text-space-border">•</span>
            <Link href="/auth/cadastro" className="hover:text-nebula-cyan transition-colors">
              Criar Conta de Pesquisador →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
