import * as React from "react";
import Link from "next/link";
import { Telescope, Compass, ChevronDown, Sparkles, Radio } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";
import { OBSERVATORIO_CONFIG } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-space-border/50">
      {/* Background Cinematográfico Cósmico com Deep Sky & Nebulosas */}
      <div className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_10s_ease-in-out_infinite_alternate]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 35%, rgba(56, 189, 248, 0.12), transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.08), transparent 40%),
              radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.06), transparent 45%),
              linear-gradient(180deg, rgba(8, 11, 16, 0.4) 0%, rgba(8, 11, 16, 0.85) 70%, #080B10 100%),
              url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2670&auto=format&fit=crop')`,
          }}
        />
        {/* Camada sutil de ruído/partículas */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      </div>

      <Container size="default" className="relative z-10 py-20 text-center flex flex-col items-center">
        {/* Badge de Telemetria Ao Vivo estilo Vercel / SpaceX */}
        <div className="inline-flex items-center gap-2.5 rounded-full cosmic-glass px-4 py-1.5 mb-8 border border-nebula-cyan/30 shadow-glow-cyan animate-in fade-in slide-in-from-bottom-3 duration-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aurora-green"></span>
          </span>
          <span className="font-mono text-xs font-medium text-lunar-silver tracking-wide">
            Estação Otto de Alencar • Fortaleza ({OBSERVATORIO_CONFIG.LATITUDE}°, {OBSERVATORIO_CONFIG.LONGITUDE}°)
          </span>
          <span className="hidden sm:inline text-space-border">|</span>
          <span className="hidden sm:inline font-mono text-[11px] text-nebula-cyan uppercase tracking-wider">
            Céu Noturno Monitorado
          </span>
        </div>

        {/* Título Principal Tipográfico Impactante */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-lunar-silver max-w-5xl leading-[1.08] mb-6">
          Descubra o Universo que está{" "}
          <span className="bg-gradient-to-r from-nebula-cyan via-lunar-silver to-stellar-amber bg-clip-text text-transparent">
            acima de você.
          </span>
        </h1>

        {/* Subtítulo Sofisticado */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-space-text-muted font-normal leading-relaxed mb-10 text-balance">
          Cálculos astronômicos de alta precisão motorizados por dados da NASA JPL e Skyfield.
          Acompanhe planetas visíveis, trânsitos celestes e registre suas observações a partir do Ceará.
        </p>

        {/* CTAs de Alta Conversão */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/ceu-hoje" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto gap-2.5 shadow-glow-cyan font-semibold text-base px-8 h-12"
            >
              <Compass className="h-5 w-5" />
              Explorar o Céu Hoje
            </Button>
          </Link>

          <Link href="/registros/novo" className="w-full sm:w-auto">
            <Button
              variant="glass"
              size="lg"
              className="w-full sm:w-auto gap-2.5 border-space-border/80 hover:border-nebula-cyan/40 text-base px-7 h-12"
            >
              <Telescope className="h-5 w-5 text-nebula-cyan" />
              Registrar Observação
            </Button>
          </Link>
        </div>

        {/* Métricas Rápidas Rápidas no Hero estilo Stripe */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-16 pt-12 border-t border-space-border/40 w-full max-w-4xl text-left">
          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-lunar-silver">100%</span>
            <p className="text-xs text-space-text-muted">Cálculos Locais Offline</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-nebula-cyan">DE421</span>
            <p className="text-xs text-space-text-muted">Efemérides NASA JPL</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-stellar-amber">0.1°</span>
            <p className="text-xs text-space-text-muted">Precisão Alt/Azimute</p>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-aurora-green">Ao Vivo</span>
            <p className="text-xs text-space-text-muted">Visibilidade Noturna</p>
          </div>
        </div>
      </Container>

      {/* Indicador Suave de Scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-space-text-muted animate-bounce pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest text-space-text-muted/70">
          Rolar para explorar
        </span>
        <ChevronDown className="h-4 w-4 text-nebula-cyan" />
      </div>
    </section>
  );
}
