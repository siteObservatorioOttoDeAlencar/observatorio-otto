"use client";

import * as React from "react";
import { Compass, Moon, Orbit, Telescope, Eye, Clock, MapPin, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { useSkyToday } from "@/features/sky-today/hooks/useSkyToday";
import { SkyDomeRadar } from "@/features/sky-today/components/SkyDomeRadar";
import { SkyCardGrid } from "@/features/sky-today/components/SkyCardGrid";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { calcularIluminacaoLunar } from "@/lib/utils/astronomy";

export default function CeuHojePage() {
  const { data, isLoading, isError, refetch, isFetching } = useSkyToday();

  // Dados calculados de iluminação lunar compartilhados
  const moonIllumination = React.useMemo(() => {
    return calcularIluminacaoLunar(data?.fase_lua_graus);
  }, [data?.fase_lua_graus]);

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-8">
      {/* Cabeçalho da Estação de Observação */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-space-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-nebula-cyan/30 bg-nebula-cyan/10 px-3 py-1 text-xs font-mono text-nebula-cyan mb-2">
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            <span>ESTAÇÃO DE EFEMÉRIDES EM TEMPO REAL</span>
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
            O Céu Hoje em Fortaleza
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
            Projeção polar e rastreamento astronômico de alta precisão calculado
            diretamente nas coordenadas do Observatório Otto de Alencar através do motor Skyfield (JPL/NASA).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-space-border bg-space-surface-1 px-4 py-2 font-mono text-xs text-space-text-muted">
            <MapPin className="h-4 w-4 text-nebula-cyan" />
            <span>3.78° S, 38.57° O • 28m alt</span>
          </div>

          <Button
            variant="glass"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-lunar-silver"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="text-lunar-silver font-medium">Atualizar</span>
          </Button>
        </div>
      </div>

      {/* Estados de Carregamento / Erro */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 h-[460px]">
            <Skeleton className="w-full h-full rounded-2xl" />
          </div>
          <div className="lg:col-span-6 space-y-4">
            <Skeleton className="w-full h-28 rounded-2xl" />
            <Skeleton className="w-full h-28 rounded-2xl" />
            <Skeleton className="w-full h-28 rounded-2xl" />
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-2xl border border-crimson-deep/40 bg-crimson-deep/10 p-6 text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-crimson-deep" />
          <h3 className="font-display font-semibold text-lunar-silver">
            Falha na conexão com o servidor de efemérides
          </h3>
          <p className="text-sm text-space-text-muted max-w-md mx-auto">
            Não foi possível calcular as posições planetárias em tempo real. Verifique a execução do backend FastAPI.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      )}

      {data && (
        <>
          {/* Métricas Principais da Noite */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
              <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
                Planetas Acima do Horizonte
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl sm:text-3xl font-bold text-nebula-cyan">
                  {data.planetas_visiveis_agora.length}
                </span>
                <span className="text-xs text-space-text-muted">corpos</span>
              </div>
            </div>

            <div className="cosmic-glass rounded-xl p-4 border border-space-border/80 overflow-hidden">
              <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
                Fase Lunar Atual
              </span>
              <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                <span className="font-display text-xl sm:text-2xl font-bold text-stellar-amber truncate">
                  {data.fase_lua_nome}
                </span>
                <span className="text-xs text-space-text-muted shrink-0">({moonIllumination}%)</span>
              </div>
            </div>

            <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
              <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
                Horário da Medição
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm sm:text-base font-medium text-lunar-silver">
                  {new Date(data.data_hora_utc).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} UTC
                </span>
                <span className="text-[10px] text-space-text-muted">(Fortaleza)</span>
              </div>
            </div>

            <div className="cosmic-glass rounded-xl p-4 border border-space-border/80">
              <span className="text-xs font-mono text-space-text-muted uppercase tracking-wider block mb-1">
                Condição Atmosférica
              </span>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-aurora-green animate-pulse" />
                <span className="text-sm font-medium text-lunar-silver">Céu Limpo</span>
              </div>
            </div>
          </div>

          {/* Seção Principal: Radar 2D + Detalhamento da Lua */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Radar Polar do Domo Celeste */}
            <div id="radar" className="lg:col-span-6 space-y-4 scroll-mt-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Orbit className="h-5 w-5 text-nebula-cyan" />
                  <h2 className="font-display text-lg font-semibold text-lunar-silver">
                    Radar Polar do Domo Celeste
                  </h2>
                </div>
                <Badge variant="outline" className="font-mono text-[10px]">
                  Zênite ao Centro (90°)
                </Badge>
              </div>

              <SkyDomeRadar
                planetas={data.planetas_visiveis_agora}
                faseLuaGraus={data.fase_lua_graus}
                faseLuaNome={data.fase_lua_nome}
              />
              <p className="text-xs text-space-text-muted text-center font-mono">
                Ponto de visualização voltado para a abóbada celeste equatorial de Fortaleza (Ceará).
              </p>
            </div>

            {/* Painel Lateral: Lua & Mecânica Celeste */}
            <div className="lg:col-span-6 space-y-6">
              {/* Card Destaque da Lua */}
              <div id="lua" className="cosmic-glass rounded-2xl p-6 border border-space-border/80 space-y-4 scroll-mt-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-stellar-amber/10 p-3 text-stellar-amber">
                      <Moon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold text-space-text">
                        Lua em Fase {data.fase_lua_nome}
                      </h3>
                      <p className="text-xs text-space-text-muted font-mono">
                        Iluminação visível da superfície lunar
                      </p>
                    </div>
                  </div>
                  <Badge variant="subtle" className="text-stellar-amber border-stellar-amber/30 text-xs">
                    {moonIllumination}% Iluminada
                  </Badge>
                </div>

                <div className="relative h-2 w-full bg-space-surface-2 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-stellar-amber/40 to-stellar-amber rounded-full"
                    style={{ width: `${moonIllumination}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-space-border/60">
                  <div>
                    <span className="text-space-text-muted block">Impacto no Céu:</span>
                    <span className="text-lunar-silver">
                      {moonIllumination > 70 ? "Céu claro (bom para a Lua)" : "Céu escuro (ideal para ver estrelas)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-space-text-muted block">Dica de Observação:</span>
                    <span className="text-nebula-cyan">
                      {moonIllumination > 70 ? "Observe crateras na borda da sombra" : "Aproveite para buscar galáxias e planetas"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guia Rápido de Instrumentação */}
              <div className="cosmic-glass rounded-2xl p-6 border border-space-border/80 space-y-4">
                <div className="flex items-center gap-2 text-lunar-silver font-display font-semibold">
                  <Telescope className="h-5 w-5 text-nebula-cyan" />
                  <span>Instrumentação Recomendada Esta Noite</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-space-border bg-space-surface-1 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-nebula-cyan mb-1">
                      <Eye className="h-3.5 w-3.5" />
                      <span>A Olho Nu / Binóculos</span>
                    </div>
                    <p className="text-xs text-space-text-muted">
                      Vênus e Júpiter de fácil identificação logo após o crepúsculo. Constelações austrais nítidas.
                    </p>
                  </div>

                  <div className="rounded-xl border border-space-border bg-space-surface-1 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-nebula-cyan mb-1">
                      <Telescope className="h-3.5 w-3.5" />
                      <span>Telescópios Refletores</span>
                    </div>
                    <p className="text-xs text-space-text-muted">
                      Anéis de Saturno e quatro luas galileanas visíveis com abertura &gt; 114mm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Planetas Visíveis */}
          <div id="planetas" className="space-y-6 pt-6 scroll-mt-24">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-lunar-silver">
                  Planetas Acima do Horizonte Agora
                </h2>
                <p className="text-sm text-space-text-muted mt-1">
                  Corpos do Sistema Solar com altitude &gt; 0° no céu de Fortaleza.
                </p>
              </div>
              <Badge variant="visible">
                {data.planetas_visiveis_agora.length} Corpos em Janela Ótica
              </Badge>
            </div>

            {data.planetas_visiveis_agora.length > 0 ? (
              <SkyCardGrid planetas={data.planetas_visiveis_agora} />
            ) : (
              <div className="rounded-2xl cosmic-glass border border-space-border/80 p-8 text-center">
                <Orbit className="mx-auto h-8 w-8 text-space-text-muted mb-2" />
                <p className="text-sm text-space-text-muted">
                  Nenhum dos planetas principais está acima do horizonte neste exato instante.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
