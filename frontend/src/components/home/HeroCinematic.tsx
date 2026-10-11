"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Telescope, Compass, ChevronDown, Radio, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { OBSERVATORIO_CONFIG } from "@/lib/constants";

export function HeroCinematic() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[96vh] flex items-center justify-center overflow-hidden border-b border-space-border/40"
    >
      {/* Background Cinematográfico com Parallax Apple/NASA */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 -z-20 scale-110 pointer-events-none"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.15), transparent 60%),
              radial-gradient(ellipse at 80% 85%, rgba(245, 158, 11, 0.08), transparent 50%),
              linear-gradient(180deg, rgba(8, 11, 16, 0.3) 0%, rgba(8, 11, 16, 0.85) 75%, #080B10 100%),
              url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2670&auto=format&fit=crop')`,
          }}
        />
        {/* Starfield micro-partículas orgânicas */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(226,232,240,0.15)_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />
      </motion.div>

      {/* Conteúdo com Fade-in e Tipografia Hero */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full"
      >
        <Container size="default" className="py-24 text-center flex flex-col items-center">
          {/* Badge de Telemetria Orbital Vercel/SpaceX */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 rounded-full cosmic-glass px-4 py-1.5 mb-8 border border-white/10 shadow-cosmic-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aurora-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aurora-green"></span>
            </span>
            <span className="font-mono text-[11px] text-lunar-silver tracking-wider uppercase">
              Fortaleza • Lat {OBSERVATORIO_CONFIG.LATITUDE}° • Lon {OBSERVATORIO_CONFIG.LONGITUDE}°
            </span>
            <span className="text-space-border/80">|</span>
            <span className="font-mono text-[11px] text-nebula-cyan tracking-widest uppercase">
              Skyfield JPL DE421 Online
            </span>
          </motion.div>

          {/* Título de Impacto: Fascínio */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-lunar-silver max-w-5xl leading-[1.05] mb-8"
          >
            Descubra o Cosmos que está{" "}
            <span className="bg-gradient-to-r from-nebula-cyan via-lunar-silver to-stellar-amber bg-clip-text text-transparent">
              acima de nós.
            </span>
          </motion.h1>

          {/* Subtítulo Editorial */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl text-base sm:text-lg md:text-xl text-space-text-muted font-normal leading-relaxed mb-12 text-balance"
          >
            O portal científico do Observatório Otto de Alencar combina dados de efemérides da NASA a cálculos locais em tempo real para revelar o céu noturno do Ceará.
          </motion.p>

          {/* Ações com Microinterações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/ceu-hoje" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto gap-2.5 font-semibold text-base px-8 h-12 shadow-glow-cyan transition-transform duration-200 hover:scale-[1.02]"
              >
                <Compass className="h-5 w-5" />
                Explorar Janela Celeste de Hoje
              </Button>
            </Link>

            <Link href="/registros/novo" className="w-full sm:w-auto">
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto gap-2.5 border-space-border/80 hover:border-nebula-cyan/40 text-base px-7 h-12 transition-transform duration-200 hover:scale-[1.02]"
              >
                <Telescope className="h-5 w-5 text-nebula-cyan" />
                Submeter Registro de Observação
              </Button>
            </Link>
          </motion.div>

          {/* Barra de Telemetria Física Linear/Stripe */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mt-20 pt-10 border-t border-space-border/40 w-full max-w-4xl text-left font-mono"
          >
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-lunar-silver">100%</span>
              <p className="text-xs text-space-text-muted">Cálculo Autônomo Offline</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-nebula-cyan">DE421</span>
              <p className="text-xs text-space-text-muted">Efemérides JPL/NASA</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-stellar-amber">0.1°</span>
              <p className="text-xs text-space-text-muted">Precisão Alt/Azimute</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-bold text-aurora-green flex items-center gap-1.5">
                <Activity className="h-4 w-4" /> Ao Vivo
              </span>
              <p className="text-xs text-space-text-muted">Trânsitos em Fortaleza</p>
            </div>
          </motion.div>
        </Container>
      </motion.div>

      {/* Indicador de Descoberta */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-space-text-muted/70 pointer-events-none">
        <span className="text-[10px] font-mono uppercase tracking-widest">
          Deslize para iniciar a jornada
        </span>
        <ChevronDown className="h-4 w-4 text-nebula-cyan animate-bounce" />
      </div>
    </section>
  );
}
