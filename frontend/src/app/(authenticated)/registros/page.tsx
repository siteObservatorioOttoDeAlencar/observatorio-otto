"use client";

import * as React from "react";
import Link from "next/link";
import { Telescope, PlusCircle, Calendar, User, Compass, Sparkles, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/authStore";

// Registros de demonstração com padrão científico do Observatório
const OBSERVATION_LOGS_SAMPLE = [
  {
    id: 1,
    objeto_celeste: "Júpiter e Luas Galileanas",
    data_hora: "2026-10-10T22:45:00Z",
    usuario: "Prof. Cláudio Bezerra",
    equipamento_utilizado: "Telescópio Schmidt-Cassegrain 8'' f/10 + Ocular 15mm",
    anotacoes: "Trânsito nítido da Grande Mancha Vermelha com seeing Antoniadi II. Quatro satélites (Io, Europa, Ganimedes e Calisto) visíveis em alinhamento equatorial.",
    altitude: 58.2,
    azimute: 72.4,
    categoria: "Planeta",
  },
  {
    id: 2,
    objeto_celeste: "Cratera Copérnico (Lua)",
    data_hora: "2026-10-09T20:15:00Z",
    usuario: "Dra. Mariana Vasconcelos",
    equipamento_utilizado: "Refletor Newtoniano 200mm + Filtro Polarizador Variável",
    anotacoes: "Paredes terraceadas e picos centrais com relevo acentuado devido ao baixo ângulo solar no terminador lunar. Excelente contraste fotométrico.",
    altitude: 64.0,
    azimute: 110.1,
    categoria: "Lua",
  },
  {
    id: 3,
    objeto_celeste: "Nebulosa de Órion (M42)",
    data_hora: "2026-10-08T01:30:00Z",
    usuario: "Lucas Pinheiro",
    equipamento_utilizado: "Apostromático 80mm ED + Câmera CMOS Refrigerada",
    anotacoes: "Trapézio resolvido com 4 estrelas nítidas (A, B, C, D). Estrutura filamentar de hidrogênio-alfa observável com filtro UHC mesmo sob céu suburbano.",
    altitude: 41.5,
    azimute: 88.9,
    categoria: "Céu Profundo",
  },
  {
    id: 4,
    objeto_celeste: "Saturno e Divisão de Cassini",
    data_hora: "2026-10-07T21:10:00Z",
    usuario: "Ana Luísa Barreto",
    equipamento_utilizado: "Maksutov-Cassegrain 127mm + Barret 2x",
    anotacoes: "Anéis A e B visivelmente separados pela divisão de Cassini. Titã e Reia identificados como pontos de magnitude 8.4 e 9.7.",
    altitude: 49.8,
    azimute: 95.3,
    categoria: "Planeta",
  },
];

export default function RegistrosFeedPage() {
  const { isAuthenticated } = useAuthStore();
  const [filtro, setFiltro] = React.useState<string>("Todos");

  const filtrados = React.useMemo(() => {
    if (filtro === "Todos") return OBSERVATION_LOGS_SAMPLE;
    return OBSERVATION_LOGS_SAMPLE.filter((r) => r.categoria === filtro);
  }, [filtro]);

  return (
    <div className="py-6 sm:py-10 space-y-8">
      {/* Top Banner & Ações */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-space-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ACERVO COMUNITÁRIO DE OBSERVAÇÃO</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
            Mural de Registros Astronômicos
          </h1>
          <p className="text-xs sm:text-sm text-space-text-muted mt-1 max-w-xl">
            Sessões observacionais, relatórios óticos e logs de telescópio submetidos
            pelos pesquisadores e astrônomos do Observatório Otto de Alencar.
          </p>
        </div>

        <Link href={isAuthenticated ? "/registros/novo" : "/auth/login"}>
          <Button variant="primary" className="gap-2 shadow-cosmic-sm shrink-0">
            <PlusCircle className="h-4 w-4" />
            <span>Novo Registro</span>
          </Button>
        </Link>
      </div>

      {/* Barra de Filtros */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="h-3.5 w-3.5 text-space-text-muted shrink-0 mr-1" />
        {["Todos", "Planeta", "Lua", "Céu Profundo"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              filtro === cat
                ? "bg-nebula-cyan/20 text-nebula-cyan border border-nebula-cyan/40 shadow-cosmic-sm"
                : "border border-space-border/60 text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-1"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de Registros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtrados.map((log) => (
          <article
            key={log.id}
            className="cosmic-glass rounded-2xl p-6 border border-space-border/80 flex flex-col justify-between hover:border-nebula-cyan/40 transition-colors group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-xl bg-space-surface-2 p-2.5 text-nebula-cyan border border-space-border/60 group-hover:scale-105 transition-transform">
                    <Telescope className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-lunar-silver">
                      {log.objeto_celeste}
                    </h2>
                    <span className="text-[11px] font-mono text-space-text-muted">
                      {log.categoria}
                    </span>
                  </div>
                </div>

                <Badge variant="subtle" className="font-mono text-[10px]">
                  Alt: {log.altitude}° • Az: {log.azimute}°
                </Badge>
              </div>

              <p className="text-sm text-lunar-silver/85 leading-relaxed bg-space-surface-1/50 rounded-xl p-3 border border-space-border/40">
                "{log.anotacoes}"
              </p>

              {log.equipamento_utilizado && (
                <div className="text-xs font-mono text-space-text-muted">
                  <span className="text-nebula-cyan">Ótica:</span> {log.equipamento_utilizado}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-space-border/60 flex items-center justify-between text-xs text-space-text-muted font-mono">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-nebula-cyan" />
                <span>{log.usuario}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(log.data_hora).toLocaleDateString("pt-BR")}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
