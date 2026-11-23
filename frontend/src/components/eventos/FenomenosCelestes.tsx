"use client";

import * as React from "react";
import Link from "next/link";
import { Calendar, Sparkles, Clock, MapPin, Eye, Compass, ArrowRight, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface EventoAstronomico {
  id: number;
  titulo: string;
  data: string;
  horario: string;
  categoria: string;
  visibilidade: string;
  descricao: string;
  equipamento: string;
}

const EVENTOS_ASTRONOMICOS: EventoAstronomico[] = [
  {
    id: 1,
    titulo: "Chuva de Meteoros Orionídeas (Detritos do Cometa Halley)",
    data: "21 a 22 de Outubro de 2026",
    horario: "01:00 às 04:30 (Horário de Fortaleza)",
    categoria: "Meteoros",
    visibilidade: "Alta (Céu sem interferência lunar)",
    descricao: "Pico de atividade da chuva associada aos fragmentos do Cometa 1P/Halley. Taxa zenital estimada em 20 a 25 meteoros por hora com traços rápidos e persistentes.",
    equipamento: "A olho nu / Cadeira reclinável voltada para o Leste",
  },
  {
    id: 2,
    titulo: "Grande Conjunção Equatorial: Vênus e Júpiter",
    data: "14 de Novembro de 2026",
    horario: "18:15 às 19:45 (Após o crepúsculo)",
    categoria: "Conjunção",
    visibilidade: "Excelente (Magnitude combinada -4.2 / -2.4)",
    descricao: "Separação aparente de apenas 0.4° no céu ocidental. Excelente oportunidade para enquadramento conjunto no mesmo campo visual de telescópios e teleobjetivas.",
    equipamento: "Binóculos 10x50 ou Telescópios com ocular de campo amplo",
  },
  {
    id: 3,
    titulo: "Eclipse Lunar Penumbral Visível em Fortaleza",
    data: "03 de Março de 2027",
    horario: "22:10 às 01:40 (Trânsito Zênite)",
    categoria: "Eclipse",
    visibilidade: "Média (Sutil escurecimento do limbo norte)",
    descricao: "A Lua ingressará na penumbra da Terra. Embora sutil ao olho nu, a variação na fotometria do disco lunar pode ser quantificada com precisão por sensores astronômicos.",
    equipamento: "Telescópio com filtro polarizador / Fotometria CMOS",
  },
  {
    id: 4,
    titulo: "Oposição de Saturno e Inclinação Máxima dos Anéis",
    data: "27 de Setembro de 2026",
    horario: "Visível a noite inteira (Zênite às 00:15)",
    categoria: "Oposição",
    visibilidade: "Perfeita (Diâmetro aparente máximo de 19.2 arcsec)",
    descricao: "O planeta dos anéis estará no ponto mais próximo da Terra em sua órbita. Divisão de Cassini e sombras projetadas no disco visíveis com extremo contraste.",
    equipamento: "Telescópios refletores ou catadióptricos de 100mm a 200mm",
  },
];

/** Calendário editorial (estático) de fenômenos celestes — complementa a agenda do observatório. */
export function FenomenosCelestes() {
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("Todos");

  const filtrados = React.useMemo(() => {
    if (categoriaAtiva === "Todos") return EVENTOS_ASTRONOMICOS;
    return EVENTOS_ASTRONOMICOS.filter((e) => e.categoria === categoriaAtiva);
  }, [categoriaAtiva]);

  const categorias = ["Todos", "Meteoros", "Conjunção", "Eclipse", "Oposição"];

  return (
    <section className="space-y-8" aria-labelledby="fenomenos-titulo">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-space-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>CALENDÁRIO DE FENÔMENOS CELESTES</span>
          </div>
          <h2 id="fenomenos-titulo" className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-lunar-silver">
            Fenômenos Astronômicos
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
            Previsões de efemérides, chuvas de meteoros, oposições e conjunções calculadas
            especificamente para observadores em Fortaleza e região equatorial.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <Filter className="h-3.5 w-3.5 text-space-text-muted shrink-0 mr-1" />
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`rounded-lg px-3.5 py-1.5 font-medium transition-all ${
                categoriaAtiva === cat
                  ? "bg-nebula-cyan/20 text-nebula-cyan border border-nebula-cyan/40 shadow-cosmic-sm"
                  : "border border-space-border/60 text-space-text-muted hover:text-lunar-silver hover:bg-space-surface-1"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-6">
        {filtrados.map((ev) => (
          <article
            key={ev.id}
            className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 hover:border-nebula-cyan/40 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge variant="subtle" className="text-nebula-cyan border-nebula-cyan/30 text-xs">
                  {ev.categoria}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-mono text-space-text-muted">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{ev.data}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-mono text-aurora-green">
                <Eye className="h-3.5 w-3.5" />
                <span>{ev.visibilidade}</span>
              </div>
            </div>

            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver">
                {ev.titulo}
              </h2>
              <div className="flex items-center gap-2 text-xs font-mono text-space-text-muted mt-1">
                <Clock className="h-3.5 w-3.5 text-nebula-cyan" />
                <span>Janela: {ev.horario}</span>
              </div>
            </div>

            <p className="text-sm text-lunar-silver/85 leading-relaxed">
              {ev.descricao}
            </p>

            <div className="pt-4 border-t border-space-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-space-text-muted">
              <div>
                <span className="text-nebula-cyan">Instrumentação:</span> {ev.equipamento}
              </div>

              <Link
                href="/ceu-hoje"
                className="inline-flex items-center gap-1.5 text-nebula-cyan hover:underline font-medium"
              >
                <span>Acompanhar no Radar</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
