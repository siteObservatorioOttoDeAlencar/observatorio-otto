"use client";

import * as React from "react";
import Link from "next/link";
import { Telescope, Calendar, Clock, MapPin, ArrowRight, Users, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function ExperienciaRealObservatorio() {
  return (
    <section className="py-12 sm:py-16 md:py-20 relative border-b border-white/[0.08] bg-space-background">
      <Container size="default">
        <div className="rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 bg-space-surface-1 border border-white/[0.1] relative overflow-hidden">
          {/* Luz de destaque */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-nebula-cyan/5 blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Texto de Convite Físico */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-nebula-cyan">
                <Users className="h-3.5 w-3.5 text-nebula-cyan" />
                <span>OBSERVAÇÃO PÚBLICA GRATUITA NO OBSERVATÓRIO</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Quer ver esses astros pelo telescópio principal?
              </h2>

              <p className="text-sm sm:text-base text-space-text-muted leading-relaxed">
                Todos os sábados à noite, o Observatório Otto de Alencar abre suas cúpulas para o público geral, escolas e famílias em Fortaleza. Nossos astrônomos apontam os telescópios de grande abertura diretamente para Júpiter, os anéis de Saturno e a Lua.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-mono text-lunar-silver">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-space-surface-2 border border-white/[0.04]">
                  <Calendar className="h-4 w-4 text-stellar-amber shrink-0" />
                  <span>Todo Sábado: 19h00 às 22h00</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-space-surface-2 border border-white/[0.04]">
                  <MapPin className="h-4 w-4 text-nebula-cyan shrink-0" />
                  <span>Campus Universitário • Fortaleza</span>
                </div>
              </div>
            </div>

            {/* Card de Ação */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="rounded-2xl p-6 bg-space-surface-2/80 border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-2 text-aurora-green text-xs font-mono font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Entrada Aberta e Gratuita</span>
                </div>

                <p className="text-xs text-space-text-muted leading-relaxed">
                  Não é necessário cadastro prévio para visitantes individuais. Para turmas escolares de grande porte, realize o agendamento prévio com a equipe.
                </p>

                <div className="space-y-2 pt-2">
                  <Link href="/contato" className="block w-full">
                    <Button variant="primary" className="w-full gap-2 justify-center">
                      <span>Agendar Visita ou Tirar Dúvidas</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/sobre" className="block w-full">
                    <Button variant="outline" className="w-full justify-center text-xs">
                      Conhecer Nossos Telescópios
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
