"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Telescope, Sparkles, Volume2, VolumeX, Eye } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { OBSERVATORIO_CONFIG } from "@/lib/constants";

export function HeroVisionPro() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Efeito de Profundidade Espacial Espelhada (Spatial Computing / Apple Vision Pro)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const blurValue = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(12px)"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[95vh] flex flex-col justify-between overflow-hidden border-b border-white/[0.08]"
    >
      {/* Background Espacial Imersivo (Vision Pro Backdrop) */}
      <motion.div
        style={{ scale, y, filter: blurValue }}
        className="absolute inset-0 -z-20 pointer-events-none"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 40%, rgba(56, 189, 248, 0.12), transparent 55%),
              radial-gradient(ellipse at 80% 85%, rgba(245, 158, 11, 0.08), transparent 45%),
              linear-gradient(180deg, rgba(8, 11, 16, 0.2) 0%, rgba(8, 11, 16, 0.75) 65%, #080B10 100%),
              url('https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2670&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
      </motion.div>

      {/* Topo da Capa: Identificação Editorial de Revista Científica */}
      <Container size="default" className="pt-8 sm:pt-12 w-full z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-3 gap-2 font-mono text-[10px] sm:text-[11px] text-space-text-muted">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-lunar-silver font-semibold tracking-wider uppercase">
              REVISTA DIGITAL DO OBSERVATÓRIO
            </span>
            <span className="text-space-border hidden xs:inline">•</span>
            <span className="text-space-text-muted">EDIÇÃO Nº 42 • OUT 2026</span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className="text-nebula-cyan flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-aurora-green animate-pulse" />
              HORIZONTE EQUATORIAL: {OBSERVATORIO_CONFIG.LATITUDE}° S
            </span>
            <span className="text-space-border">•</span>
            <span>FORTALEZA, CE</span>
          </div>
        </div>
      </Container>

      {/* Centro: Tipografia Escultural & Spatial Glass (Estilo Vision Pro / Apple) */}
      <motion.div style={{ opacity }} className="my-auto z-10 w-full py-8 sm:py-16">
        <Container size="default" className="text-center flex flex-col items-center">
          {/* Spatial Capsule Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 bg-white/[0.04] backdrop-blur-xl border border-white/[0.1] shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-nebula-cyan" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-lunar-silver">
              O Céu Profundo em Perspectiva Imersiva
            </span>
          </motion.div>

          {/* Título de Capa da Revista */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-5xl leading-[1.02] mb-6 text-balance"
          >
            A Fronteira Visível{" "}
            <span className="bg-gradient-to-b from-white via-lunar-silver to-white/50 bg-clip-text text-transparent">
              do Universo.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-sm sm:text-base md:text-lg text-lunar-silver/80 font-light leading-relaxed mb-8 sm:mb-10 text-balance"
          >
            Um olhar computacional e contemplativo sobre as noites do Ceará. Telemetria de efemérides em tempo real alimentada pelo legado científico de Otto de Alencar.
          </motion.p>

          {/* Ações em Spatial Glass Glassmorphic Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
          >
            <Link href="/ceu-hoje" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-11 sm:h-12 px-7 rounded-full bg-white text-space-background font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-all duration-200 shadow-sm active:scale-[0.98]">
                <Compass className="h-4 w-4" />
                Explorar a Abóboda Celeste
              </button>
            </Link>

            <Link href="/registros/novo" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto h-11 sm:h-12 px-6 rounded-full bg-white/[0.06] hover:bg-white/[0.10] text-lunar-silver border border-white/[0.12] backdrop-blur-md font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]">
                <Telescope className="h-4 w-4 text-nebula-cyan" />
                Caderno de Observação
              </button>
            </Link>
          </motion.div>
        </Container>
      </motion.div>

      {/* Rodapé da Capa: Sumário Rápido da Edição */}
      <Container size="default" className="pb-6 sm:pb-8 z-10 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-5 sm:pt-6 border-t border-white/[0.08] font-mono text-xs">
          <div>
            <span className="text-space-text-muted block text-[10px] uppercase">CAPA DESTAQUE</span>
            <span className="text-lunar-silver font-medium">Júpiter em Oposição Equatorial</span>
          </div>
          <div>
            <span className="text-space-text-muted block text-[10px] uppercase">EFEMÉRIDES</span>
            <span className="text-nebula-cyan font-medium">NASA JPL DE421 Ativo</span>
          </div>
          <div>
            <span className="text-space-text-muted block text-[10px] uppercase">HISTÓRIA CEARENSE</span>
            <span className="text-stellar-amber font-medium">Otto de Alencar & Sobral 1919</span>
          </div>
          <div>
            <span className="text-space-text-muted block text-[10px] uppercase">VERIFICAÇÃO</span>
            <span className="text-aurora-green font-medium">0.1° Precisão de Azimute</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
