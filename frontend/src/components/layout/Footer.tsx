import * as React from "react";
import Link from "next/link";
import { Telescope, Compass, MapPin, Mail, ExternalLink, ShieldCheck, Database } from "lucide-react";
import { OBSERVATORIO_CONFIG } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-space-border/60 bg-space-surface-1/90 backdrop-blur-md text-space-text-muted mt-auto">
      {/* Faixa superior de telemetria / coordenadas do observatório */}
      <div className="border-b border-space-border/40 py-3 bg-space-background/40">
        <div className="container mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-lunar-silver">
            <span className="flex h-2 w-2 rounded-full bg-aurora-green animate-pulse" />
            <span className="text-space-text-muted">Estação de Monitoramento:</span>
            <span className="text-nebula-cyan font-semibold">Fortaleza, CE</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>
              Lat: <strong className="text-lunar-silver">{OBSERVATORIO_CONFIG.LATITUDE}°</strong>
            </span>
            <span>
              Lon: <strong className="text-lunar-silver">{OBSERVATORIO_CONFIG.LONGITUDE}°</strong>
            </span>
            <span className="hidden sm:inline">
              Fuso: <strong className="text-lunar-silver">UTC-3</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Conteúdo principal do rodapé */}
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Coluna 1: Sobre a Instituição */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-nebula-cyan/10 p-2 text-nebula-cyan border border-nebula-cyan/20">
                <Telescope className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-lunar-silver text-base">
                Observatório Otto de Alencar
              </span>
            </div>
            <p className="text-xs leading-relaxed text-space-text-muted">
              Plataforma de extensão científica dedicada à divulgação astronômica, cálculo computacional de efemérides locais e registro comunitário de observações celestes.
            </p>
            <div className="flex items-center gap-2 text-xs text-lunar-silver">
              <MapPin className="h-4 w-4 text-nebula-cyan shrink-0" />
              <span>Fortaleza, Ceará — Brasil</span>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-lunar-silver uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ceu-hoje" className="hover:text-nebula-cyan transition-colors flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5" /> O Que Observar Hoje
                </Link>
              </li>
              <li>
                <Link href="/conteudo" className="hover:text-nebula-cyan transition-colors">
                  Artigos e Descobertas
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-nebula-cyan transition-colors">
                  Galeria de Astrofotografia
                </Link>
              </li>
              <li>
                <Link href="/registros" className="hover:text-nebula-cyan transition-colors">
                  Mural Público de Observações
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-nebula-cyan transition-colors">
                  Histórico de Otto de Alencar
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Infraestrutura & Ciência */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-lunar-silver uppercase tracking-wider">
              Pesquisa & Dados
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-nebula-cyan" />
                <span>Efemérides em Tempo Real (Fortaleza)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-aurora-green" />
                <span>Dados Científicos Abertos</span>
              </li>
              <li>
                <Link
                  href="/pesquisas"
                  className="hover:text-nebula-cyan transition-colors inline-flex items-center gap-1"
                >
                  Projetos de Pesquisa e Extensão
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="hover:text-nebula-cyan transition-colors inline-flex items-center gap-1"
                >
                  Calendário de Eventos Astronômicos
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Contato & Extensão */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-lunar-silver uppercase tracking-wider">
              Extensão Universitária
            </h4>
            <p className="text-xs text-space-text-muted">
              Projeto desenvolvido para fomento à ciência, astronomia observacional e educação pública.
            </p>
            <div className="pt-1">
              <a
                href="mailto:observatorio@instituicao.ce"
                className="inline-flex items-center gap-1.5 text-xs text-nebula-cyan hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                observatorio@instituicao.ce
              </a>
            </div>
          </div>
        </div>

        {/* Linha Inferior com Copyright e Créditos */}
        <div className="pt-8 border-t border-space-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {currentYear} {OBSERVATORIO_CONFIG.NOME}. Todos os direitos reservados.</p>
          <p className="text-space-text-muted">
            Desenvolvido com padrões abertos para Astronomia Computacional.
          </p>
        </div>
      </div>
    </footer>
  );
}
