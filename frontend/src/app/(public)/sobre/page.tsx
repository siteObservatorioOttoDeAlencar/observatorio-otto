"use client";

import * as React from "react";
import Link from "next/link";
import { Telescope, Compass, BookOpen, Award, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function SobrePage() {
  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho da Página */}
      <div className="text-center space-y-3 border-b border-space-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-nebula-cyan/30 bg-nebula-cyan/10 px-3.5 py-1 text-xs font-mono text-nebula-cyan">
          <Sparkles className="h-3.5 w-3.5" />
          <span>MEMÓRIA CIENTÍFICA CEARENSE</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
          Observatório Otto de Alencar
        </h1>
        <p className="text-xs sm:text-sm text-space-text-muted max-w-2xl mx-auto">
          Um centro de excelência em astronomia observacional, divulgação científica e
          extensão universitária sediado em Fortaleza, Ceará.
        </p>
      </div>

      {/* Biografia / Tributo a Otto de Alencar Silva */}
      <section id="otto-de-alencar" className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 space-y-6 scroll-mt-24">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-space-surface-2 p-3 text-nebula-cyan border border-space-border/60">
            <Award className="h-6 w-6 cosmic-glow" />
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver">
              O Patrono: Otto de Alencar Silva (1874–1912)
            </h2>
            <span className="text-xs font-mono text-space-text-muted">
              Matemático, Astrônomo e Pioneiro do Pensamento Crítico Exato no Brasil
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-lunar-silver/85 leading-relaxed font-sans">
          <p>
            Nascido em Fortaleza, Ceará, Otto de Alencar Silva foi uma das mentes matemáticas mais brilhantes
            e rigorosas de sua geração. Formado pela Escola Politécnica do Rio de Janeiro, destacou-se pela
            profundidade epistemológica com que abordava a mecânica celeste e a análise matemática pura.
          </p>
          <p>
            Alencar antecipou debates cruciais que culminariam na confirmação experimental da Teoria da Relatividade
            Geral durante o histórico Eclipse Solar de 1919 em Sobral (Ceará). Sua recusa sistemática a explicações
            ad-hoc na física newtoniana e sua ênfase na calibração instrumental estabeleceram os mais altos padrões de
            rigor para a ciência brasileira.
          </p>
        </div>

        <div className="rounded-xl bg-space-surface-1 p-4 border border-space-border/60 text-xs font-mono text-space-text-muted flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-aurora-green shrink-0 mt-0.5" />
          <div>
            <span className="text-lunar-silver font-semibold block">Compromisso com o Rigor Matemático:</span>
            O Observatório preserva seu princípio de que toda hipótese teórica deve ser confrontada com medições
            astrométricas transparentes e reprodutíveis.
          </div>
        </div>
      </section>

      {/* Infraestrutura e Instrumentação */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-lunar-silver">
            Instrumentação Ótica do Observatório
          </h2>
          <p className="text-xs sm:text-sm text-space-text-muted mt-1">
            Equipamentos dedicados à astrometria, fotometria lunar e astrofotografia de céu profundo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="cosmic-glass rounded-xl p-5 border border-space-border/80 space-y-2">
            <Telescope className="h-5 w-5 text-nebula-cyan mb-1" />
            <h3 className="font-display font-semibold text-lunar-silver">Ritchey-Chrétien 10''</h3>
            <p className="text-xs text-space-text-muted">
              Ótica hiperbólica isenta de coma para astrofotografia de nebulosas e galáxias.
            </p>
          </div>

          <div className="cosmic-glass rounded-xl p-5 border border-space-border/80 space-y-2">
            <Telescope className="h-5 w-5 text-stellar-amber mb-1" />
            <h3 className="font-display font-semibold text-lunar-silver">Schmidt-Cassegrain 11''</h3>
            <p className="text-xs text-space-text-muted">
              Grande distância focal (2800mm) otimizada para imageamento planetário de alta resolução.
            </p>
          </div>

          <div className="cosmic-glass rounded-xl p-5 border border-space-border/80 space-y-2">
            <Compass className="h-5 w-5 text-aurora-green mb-1" />
            <h3 className="font-display font-semibold text-lunar-silver">Montagens EQ Computadorizadas</h3>
            <p className="text-xs text-space-text-muted">
              Rastreamento sideral com autoguia ativo compensando a latitude equatorial de -3.77°.
            </p>
          </div>
        </div>
      </section>

      {/* Localização e Parceria Universitária */}
      <section className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-nebula-cyan text-xs font-mono uppercase">
            <MapPin className="h-4 w-4" />
            <span>Coordenadas Geodésicas</span>
          </div>
          <h3 className="font-display text-xl font-bold text-lunar-silver">
            Fortaleza, Ceará, Brasil
          </h3>
          <p className="text-xs font-mono text-space-text-muted">
            Latitude 3° 46' 45'' S • Longitude 38° 33' 58'' O • Altitude 28 metros
          </p>
        </div>

        <Link href="/ceu-hoje">
          <Button variant="primary" className="gap-2 shrink-0">
            <span>Explorar Céu Noturno</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
