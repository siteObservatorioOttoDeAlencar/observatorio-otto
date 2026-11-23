"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Telescope, Send, CheckCircle2, Sparkles, MapPin, CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function ConviteParticipacao() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-28 sm:py-36 relative overflow-hidden border-t border-space-border/40">
      {/* Nebulosa de Fundo e Gradiente Cinematográfico */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-space-background via-space-surface-1/40 to-space-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-nebula-cyan/15 via-stellar-amber/10 to-aurora-green/5 blur-[180px] pointer-events-none" />
      </div>

      <Container size="default">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="cosmic-glass rounded-3xl p-8 sm:p-14 lg:p-20 text-center relative overflow-hidden border border-nebula-cyan/25 shadow-glow-cyan max-w-5xl mx-auto"
        >
          {/* Emblema em Destaque */}
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-space-surface-2 border border-nebula-cyan/30 text-nebula-cyan mb-8 shadow-cosmic cosmic-glow">
            <Telescope className="h-8 w-8" />
          </div>

          {/* Chamada: Fase 05 - Convite à Participação */}
          <div className="max-w-3xl mx-auto space-y-4 mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan block">
              Fase 05: Convite à Participação • Sua Janela para o Céu
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-lunar-silver leading-[1.1]">
              O Cosmos Espera por Suas Observações
            </h2>
            <p className="text-space-text-muted text-sm sm:text-lg leading-relaxed text-balance">
              Junte-se à rede de observadores do Observatório Digital Otto de Alencar. Receba boletins semanais de visibilidade, alertas de fenômenos raros e trânsitos celestes sobre o Ceará.
            </p>
          </div>

          {/* Caixa de Entrada e Newsletter com Microinteração */}
          <div className="max-w-md mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2.5 p-4 rounded-xl cosmic-glass border border-aurora-green/40 text-aurora-green font-medium text-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>Inscrição confirmada! Boas noites de céu limpo.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Seu endereço de e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-space-surface-2/90 border-space-border/80 focus:border-nebula-cyan text-sm"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="h-12 gap-2 whitespace-nowrap shadow-glow-cyan font-semibold px-6 shrink-0 transition-transform hover:scale-[1.02]"
                >
                  <Send className="h-4 w-4" />
                  Inscrever-se
                </Button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-space-text-muted">
              Sem mensagens comerciais. Conteúdo estritamente científico e acadêmico.
            </p>
          </div>

          {/* Links e Ações Secundárias */}
          <div className="mt-14 pt-8 border-t border-space-border/40 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-space-text-muted">
            <Link
              href="/sobre"
              className="flex items-center gap-1.5 hover:text-nebula-cyan transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5 text-nebula-cyan" />
              Agendar Visita ao Observatório Presencial
            </Link>
            <span className="text-space-border">•</span>
            <Link
              href="/contato"
              className="flex items-center gap-1.5 hover:text-nebula-cyan transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-stellar-amber" />
              Solicitar acesso como Astrônomo Colaborador
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
