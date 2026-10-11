"use client";

import * as React from "react";
import Link from "next/link";
import { Telescope, Compass, BookOpen, ShieldCheck, Sparkles, ArrowRight, Activity, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface LinhaPesquisa {
  id: number;
  titulo: string;
  coordenador: string;
  status: string;
  descricao: string;
  metodologia: string;
  instrumento: string;
}

const LINHAS_PESQUISA: LinhaPesquisa[] = [
  {
    id: 1,
    titulo: "Fotometria Diferencial de Asteroides Próximos da Terra (NEOs)",
    coordenador: "Dr. Marcelo Vasconcelos",
    status: "Em Coleta Contínua",
    descricao: "Determinação do período de rotação e modelagem tridimensional de corpos menores do Sistema Solar a partir de curvas de luz de alta resolução temporal.",
    metodologia: "Filtros fotométricos Johnson-Cousins (B, V, R) calibrados com estrelas de campo do catálogo Gaia DR3.",
    instrumento: "Telescópio Ritchey-Chrétien 10'' f/8 + Câmera CMOS refrigerada a -15°C.",
  },
  {
    id: 2,
    titulo: "Monitoramento Espectral da Poluição Luminosa em Fortaleza",
    coordenador: "Dra. Mariana Vasconcelos",
    status: "Ativo",
    descricao: "Quantificação do espalhamento atmosférico (Rayleigh e Mie) decorrente de iluminação pública LED na faixa espectral de 380nm a 750nm na zona metropolitana.",
    metodologia: "Fotometria contínua com sensores SQM-L e espectrógrafo de fenda acoplado em noites sem Lua.",
    instrumento: "Rede de sensores fotométricos automatizados e espectrômetro portátil calibrado.",
  },
  {
    id: 3,
    titulo: "Astrometria de Posição de Cometas e Satélites em Latitude Equatorial",
    coordenador: "Prof. Cláudio Bezerra",
    status: "Em Análise",
    descricao: "Medição de coordenadas equatoriais com precisão sub-segundo de arco para refinamento orbital integrado ao Minor Planet Center (MPC) e NASA JPL.",
    metodologia: "Redução astrométrica utilizando software Astrometrica e catálogo USNO-B1.0.",
    instrumento: "Schmidt-Cassegrain 11'' com redutor focal f/6.3 e montagem equatorial alemã.",
  },
];

export default function PesquisasPage() {
  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8 max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="border-b border-space-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
          <Activity className="h-3.5 w-3.5" />
          <span>PROJETOS CIENTÍFICOS & EXTENSÃO UNIVERSITÁRIA</span>
        </div>
        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
          Linhas de Pesquisa
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-3xl">
          Investigações astronômicas ativas conduzidas pela equipe do Observatório Otto de Alencar
          em cooperação com redes de monitoramento internacional e universidades locais.
        </p>
      </div>

      {/* Grid de Linhas de Pesquisa */}
      <div className="space-y-6">
        {LINHAS_PESQUISA.map((proj) => (
          <article
            key={proj.id}
            className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 hover:border-nebula-cyan/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver">
                {proj.titulo}
              </h2>
              <Badge variant="visible" className="shrink-0 text-xs">
                {proj.status}
              </Badge>
            </div>

            <p className="text-sm text-lunar-silver/85 leading-relaxed">
              {proj.descricao}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-space-border/60 text-xs font-mono">
              <div className="rounded-xl bg-space-surface-1 p-3 border border-space-border/40">
                <span className="text-nebula-cyan block font-semibold mb-1">Metodologia:</span>
                <span className="text-space-text-muted">{proj.metodologia}</span>
              </div>

              <div className="rounded-xl bg-space-surface-1 p-3 border border-space-border/40">
                <span className="text-stellar-amber block font-semibold mb-1">Instrumentação Ótica:</span>
                <span className="text-space-text-muted">{proj.instrumento}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs font-mono text-space-text-muted">
              <span>Coordenador: <strong className="text-lunar-silver">{proj.coordenador}</strong></span>
              <Link
                href="/conteudo"
                className="inline-flex items-center gap-1.5 text-nebula-cyan hover:underline font-medium"
              >
                <span>Ver Publicações Relacionadas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
