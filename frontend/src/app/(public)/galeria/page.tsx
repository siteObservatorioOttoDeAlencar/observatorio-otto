"use client";

import * as React from "react";
import { Camera, Filter, ZoomIn, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Astrophoto {
  id: number;
  titulo: string;
  categoria: string;
  url: string;
  telescopio: string;
  exposicao: string;
  iso: string;
  astronomo: string;
  data: string;
}

const GALLERY_DATA: Astrophoto[] = [
  {
    id: 1,
    titulo: "Nebulosa da Tarântula (30 Doradus)",
    categoria: "Nebulosas",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Ritchey-Chrétien 10'' f/8",
    exposicao: "42 frames x 300s (H-alpha + OIII)",
    iso: "Gain 100",
    astronomo: "Laboratório de Astrofísica",
    data: "Setembro de 2026",
  },
  {
    id: 2,
    titulo: "Lua em Quarto Crescente e Mare Serenitatis",
    categoria: "Lua",
    url: "https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Refletor Newtoniano 200mm f/5",
    exposicao: "1/250s (Lucky Imaging 500 frames)",
    iso: "Gain 50",
    astronomo: "Dra. Mariana Vasconcelos",
    data: "Outubro de 2026",
  },
  {
    id: 3,
    titulo: "Júpiter, Trânsito da Grande Mancha e Io",
    categoria: "Planetas",
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Schmidt-Cassegrain 11'' + Barlow 2.5x",
    exposicao: "Vídeo SER 120fps (Derotação WinJUPOS)",
    iso: "Gain 220",
    astronomo: "Prof. Cláudio Bezerra",
    data: "Outubro de 2026",
  },
  {
    id: 4,
    titulo: "Grande Nuvem de Magalhães sobre o Céu Cearense",
    categoria: "Galáxias",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Lente Teleobjetiva 135mm f/2.0",
    exposicao: "30 frames x 120s",
    iso: "ISO 1600",
    astronomo: "Ana Luísa Barreto",
    data: "Agosto de 2026",
  },
  {
    id: 5,
    titulo: "Complexo Molecular de Rho Ophiuchi",
    categoria: "Nebulosas",
    url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Apocromático 72mm ED f/6",
    exposicao: "60 frames x 180s RGB",
    iso: "ISO 800",
    astronomo: "Lucas Pinheiro",
    data: "Julho de 2026",
  },
  {
    id: 6,
    titulo: "Anéis e Estrutura Atmosférica de Saturno",
    categoria: "Planetas",
    url: "https://images.unsplash.com/photo-1614728423169-3f65fd722b7e?q=80&w=1200&auto=format&fit=crop",
    telescopio: "Maksutov-Cassegrain 150mm",
    exposicao: "1/60s x 3000 frames empilhados",
    iso: "Gain 300",
    astronomo: "Eng. Ricardo Peixoto",
    data: "Setembro de 2026",
  },
];

export default function GaleriaPage() {
  const [categoriaAtiva, setCategoriaAtiva] = React.useState("Todos");
  const [fotoSelecionada, setFotoSelecionada] = React.useState<Astrophoto | null>(null);

  const fotosFiltradas = React.useMemo(() => {
    if (categoriaAtiva === "Todos") return GALLERY_DATA;
    return GALLERY_DATA.filter((f) => f.categoria === categoriaAtiva);
  }, [categoriaAtiva]);

  const categorias = ["Todos", "Nebulosas", "Planetas", "Lua", "Galáxias"];

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8">
      {/* Cabeçalho da Galeria */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-space-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
            <Camera className="h-3.5 w-3.5" />
            <span>ACERVO FOTOMÉTRICO DO OBSERVATÓRIO</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
            Galeria de Astrofotografia
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
            Registros de céu profundo e corpos do Sistema Solar capturados pelos
            sensores e telescópios sob o céu equatorial de Fortaleza.
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

      {/* Grid de Imagens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {fotosFiltradas.map((foto) => (
          <div
            key={foto.id}
            onClick={() => setFotoSelecionada(foto)}
            className="group cursor-pointer cosmic-glass rounded-2xl overflow-hidden border border-space-border/80 hover:border-nebula-cyan/50 transition-all hover:shadow-cosmic-md flex flex-col"
          >
            {/* Imagem Container com Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-space-surface-2">
              <img
                src={foto.url}
                alt={foto.titulo}
                className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-space-background via-transparent to-transparent opacity-60" />

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-space-background/80 backdrop-blur-md rounded-lg p-2 text-nebula-cyan border border-nebula-cyan/30">
                <ZoomIn className="h-4 w-4" />
              </div>

              <div className="absolute top-3 left-3">
                <Badge variant="subtle" className="text-xs backdrop-blur-md">
                  {foto.categoria}
                </Badge>
              </div>
            </div>

            {/* Metadados Técnicos do Card */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-display text-base font-bold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                  {foto.titulo}
                </h3>
                <p className="text-xs font-mono text-space-text-muted mt-1">
                  {foto.telescopio}
                </p>
              </div>

              <div className="pt-3 border-t border-space-border/40 flex items-center justify-between text-[11px] font-mono text-space-text-muted">
                <span>{foto.astronomo}</span>
                <span>{foto.data}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal de Inspeção com proporções confortáveis (estilo Unsplash / Notion) */}
      {fotoSelecionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 md:p-8 animate-in fade-in duration-200"
          onClick={() => setFotoSelecionada(null)}
        >
          {/* Card do Modal: ocupando confortavelmente ~70% da viewport no desktop */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-space-surface-1 border border-white/[0.1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão de Fechar Acessível e Visível */}
            <button
              onClick={() => setFotoSelecionada(null)}
              className="absolute top-3 right-3 z-20 rounded-full bg-space-background/80 hover:bg-space-background border border-white/[0.1] p-2 text-space-text-muted hover:text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-nebula-cyan"
              aria-label="Fechar visualização"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Imagem Contida: altura máxima confortável sem estourar a tela */}
            <div className="relative w-full max-h-[50vh] sm:max-h-[55vh] bg-space-background/90 flex items-center justify-center p-3 sm:p-4 overflow-hidden border-b border-white/[0.06]">
              <img
                src={fotoSelecionada.url}
                alt={fotoSelecionada.titulo}
                className="max-h-[46vh] sm:max-h-[50vh] w-auto max-w-full object-contain rounded-lg shadow-sm select-none"
              />
            </div>

            {/* Painel de Metadados: Hierarquia limpa e escaneável */}
            <div className="p-4 sm:p-5 space-y-3 bg-space-surface-1 overflow-y-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="subtle" className="text-[11px] text-nebula-cyan border-nebula-cyan/30 py-0.5">
                      {fotoSelecionada.categoria}
                    </Badge>
                    <span className="text-space-text-muted text-xs">•</span>
                    <span className="text-space-text-muted text-xs font-mono">{fotoSelecionada.data}</span>
                  </div>
                  <h2 className="font-display text-lg sm:text-xl font-bold text-space-text leading-tight">
                    {fotoSelecionada.titulo}
                  </h2>
                </div>

                <div className="text-xs font-mono text-space-text-muted sm:text-right shrink-0">
                  <span className="block text-[11px] uppercase tracking-wider text-space-text-muted/80">Fotometria</span>
                  <span className="text-lunar-silver font-medium">{fotoSelecionada.astronomo}</span>
                </div>
              </div>

              {/* Grid Técnico Compacto */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-xl bg-space-surface-2/60 p-3 border border-white/[0.06] text-xs font-mono">
                <div>
                  <span className="text-space-text-muted text-[11px] block">Telescópio:</span>
                  <span className="text-space-text font-medium truncate block">{fotoSelecionada.telescopio}</span>
                </div>
                <div>
                  <span className="text-space-text-muted text-[11px] block">Exposição:</span>
                  <span className="text-nebula-cyan font-medium truncate block">{fotoSelecionada.exposicao}</span>
                </div>
                <div>
                  <span className="text-space-text-muted text-[11px] block">Sensibilidade:</span>
                  <span className="text-space-text font-medium truncate block">{fotoSelecionada.iso}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
