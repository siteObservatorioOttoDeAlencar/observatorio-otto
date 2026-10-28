"use client";

import * as React from "react";
import { Mail, MapPin, Calendar, Clock, Send, CheckCircle2, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContatoPage() {
  const [enviado, setEnviado] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
    }, 1000);
  };

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-space-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
          <Mail className="h-3.5 w-3.5" />
          <span>CANAL DE COMUNICAÇÃO CIENTÍFICA</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
          Contato & Visitação Pública
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
          Agendamento de visitas escolares, sessões noturnas abertas ao público e
          contato com a equipe técnica do Observatório Otto de Alencar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Informações Institucionais e Visitação */}
        <div className="lg:col-span-5 space-y-6">
          <div className="cosmic-glass rounded-2xl p-6 border border-space-border/80 space-y-4">
            <h2 className="font-display text-xl font-bold text-lunar-silver flex items-center gap-2">
              <Calendar className="h-5 w-5 text-nebula-cyan" />
              <span>Sessões Noturnas Abertas</span>
            </h2>
            <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
              O observatório promove observações telescópicas gratuitas para a comunidade
              todos os sábados, voltadas para a Lua, planetas e objetos de céu profundo.
            </p>
            <div className="rounded-xl bg-space-surface-1 p-3 border border-space-border/60 text-xs font-mono space-y-1">
              <div className="flex items-center gap-2 text-lunar-silver">
                <Clock className="h-3.5 w-3.5 text-stellar-amber" />
                <span>Sábados: 19:00 às 22:00</span>
              </div>
              <p className="text-[11px] text-space-text-muted">
                *Atividades condicionadas à ausência de nebulosidade e chuva.
              </p>
            </div>
          </div>

          <div className="cosmic-glass rounded-2xl p-6 border border-space-border/80 space-y-4 text-xs font-mono">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-nebula-cyan shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-lunar-silver">Localização Geodésica</p>
                <p className="text-space-text-muted">Fortaleza, Ceará, Brasil</p>
                <p className="text-space-text-muted text-[11px]">3° 46' 45'' S, 38° 33' 58'' O</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-space-border/40">
              <Mail className="h-5 w-5 text-nebula-cyan shrink-0" />
              <div>
                <p className="font-semibold text-lunar-silver">E-mail Institucional</p>
                <p className="text-space-text-muted">contato@observatorio.ce</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Mensagem */}
        <div className="lg:col-span-7">
          <div className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver mb-2">
              Envie uma Mensagem
            </h2>
            <p className="text-xs text-space-text-muted mb-6">
              Preencha o formulário para agendamentos ou dúvidas científicas.
            </p>

            {enviado ? (
              <div className="flex items-center gap-3 rounded-xl border border-aurora-green/40 bg-aurora-green/10 p-5 text-sm text-aurora-green animate-in fade-in">
                <CheckCircle2 className="h-6 w-6 shrink-0" />
                <div>
                  <p className="font-medium">Mensagem enviada com sucesso!</p>
                  <p className="text-xs opacity-80 mt-0.5">
                    Nossa equipe responderá em até 48 horas úteis.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="text-xs font-medium text-space-text-muted mb-1 block">
                    Nome Completo
                  </label>
                  <Input id="nome" name="nome" placeholder="Seu nome ou instituição" required />
                </div>

                <div>
                  <label htmlFor="email" className="text-xs font-medium text-space-text-muted mb-1 block">
                    E-mail para Retorno
                  </label>
                  <Input id="email" name="email" type="email" placeholder="seuemail@exemplo.com" required />
                </div>

                <div>
                  <label htmlFor="assunto" className="text-xs font-medium text-space-text-muted mb-1 block">
                    Finalidade do Contato
                  </label>
                  <select
                    id="assunto"
                    name="assunto"
                    className="w-full rounded-md border border-space-border bg-space-surface-1 p-2.5 text-xs text-lunar-silver focus:border-nebula-cyan focus:outline-none"
                    required
                  >
                    <option value="visita">Agendamento de Visita Escolar / Universitária</option>
                    <option value="sessao">Informações sobre a Sessão Pública de Sábado</option>
                    <option value="pesquisa">Cooperação Científica e Pesquisa</option>
                    <option value="imprensa">Assessoria de Imprensa / Comunicação</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="mensagem" className="text-xs font-medium text-space-text-muted mb-1 block">
                    Mensagem
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    rows={4}
                    className="w-full rounded-md border border-space-border bg-space-surface-1 p-3 text-xs text-lunar-silver placeholder:text-space-text-muted focus:border-nebula-cyan focus:outline-none"
                    placeholder="Descreva detalhes do seu pedido ou dúvida astronômica..."
                    required
                  />
                </div>

                <Button type="submit" isLoading={loading} className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  <span>Transmitir Mensagem</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
