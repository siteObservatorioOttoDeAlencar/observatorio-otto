"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, Send, Terminal, Bell } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/Input";

export function CtaLinear() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStatus("success");
    }
  };

  return (
    <section className="py-14 sm:py-20 md:py-24 relative overflow-hidden bg-space-background">
      {/* Background Linear: Linhas de Grade e Glow Ciano Preciso */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-nebula-cyan/5 blur-[90px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <Container size="default">
        <div className="relative max-w-3xl mx-auto rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border border-white/[0.12] bg-space-surface-1/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Luz de Borda Superior (Linear Edge Highlight) */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-nebula-cyan to-transparent opacity-70" />

          <div className="flex flex-col items-center text-center space-y-5">
            {/* Tag Estilo Linear */}
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-nebula-cyan">
              <Bell className="h-3.5 w-3.5 text-nebula-cyan" />
              <span>BOLETIM SEMANAL DE EFEMÉRIDES CELESTES</span>
            </div>

            {/* Título Forte e Direto */}
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.1] max-w-2xl">
              Nunca perca um alinhamento celestial.
            </h2>

            <p className="text-space-text-muted text-xs sm:text-sm leading-relaxed max-w-md text-balance">
              Receba com antecedência os cálculos dos melhores horários de observação, aproximações de cometas e eventos presenciais no observatório.
            </p>

            {/* Caixa de Entrada Estilo Linear */}
            <div className="w-full max-w-md pt-2">
              {status === "success" ? (
                <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-aurora-green/10 border border-aurora-green/30 text-aurora-green text-xs font-mono">
                  <Check className="h-4 w-4" />
                  <span>Você está inscrito no boletim astronômico da edição.</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@instituicao.br"
                      required
                      className="w-full h-11 rounded-xl bg-space-surface-2 border border-white/[0.1] px-4 text-xs sm:text-sm text-white placeholder:text-space-text-muted focus:outline-none focus:border-nebula-cyan/80 focus:ring-1 focus:ring-nebula-cyan transition-all font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="h-11 px-5 rounded-xl bg-nebula-cyan text-space-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 hover:bg-nebula-cyan/90 transition-all active:scale-[0.98]"
                  >
                    <span>Assinar</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}

              <p className="mt-3 text-[10px] font-mono text-space-text-muted/70">
                Livre de rastreadores ou publicidade comercial. Código e ciência abertos.
              </p>
            </div>

            {/* Rodapé de Ações do CTA Linear */}
            <div className="pt-8 border-t border-white/[0.08] w-full flex flex-wrap items-center justify-between text-xs font-mono text-space-text-muted gap-4">
              <div className="flex items-center gap-2 text-lunar-silver">
                <span className="h-2 w-2 rounded-full bg-aurora-green animate-pulse" />
                <span>Atualizado para o céu de Fortaleza (-3.77° S)</span>
              </div>

              <div className="flex items-center gap-4">
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Visitas Presenciais
                </Link>
                <span>/</span>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Fale Conosco
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
