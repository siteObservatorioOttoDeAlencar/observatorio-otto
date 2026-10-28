"use client";

import * as React from "react";
import { PlanetaVisivel } from "@/types/astronomy";

interface SkyDomeRadarProps {
  planetas: PlanetaVisivel[];
  faseLuaGraus?: number;
  faseLuaNome?: string;
  className?: string;
}

export function SkyDomeRadar({
  planetas,
  faseLuaGraus = 0,
  faseLuaNome = "Lua",
  className = "",
}: SkyDomeRadarProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [hoveredBody, setHoveredBody] = React.useState<{
    nome: string;
    altitude: number;
    azimute: number;
    x: number;
    y: number;
  } | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let pulse = 0;

    const render = () => {
      pulse += 0.03;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 36;

      if (radius <= 0) {
        ctx.restore();
        return;
      }

      // Fundo circular do domo celeste
      const domeGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      domeGrad.addColorStop(0, "rgba(8, 14, 28, 0.95)");
      domeGrad.addColorStop(0.7, "rgba(5, 9, 20, 0.9)");
      domeGrad.addColorStop(1, "rgba(2, 6, 23, 0.95)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = domeGrad;
      ctx.fill();

      // Círculos de Altitude (Horizonte 0°, 30°, 60°)
      const rings = [
        { alt: 0, label: "0° (Horizonte)", dash: [] },
        { alt: 30, label: "30°", dash: [4, 4] },
        { alt: 60, label: "60°", dash: [4, 4] },
      ];

      rings.forEach(({ alt, label, dash }) => {
        const r = radius * (1 - alt / 90);
        ctx.beginPath();
        ctx.setLineDash(dash);
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle =
          alt === 0
            ? "rgba(0, 240, 255, 0.4)"
            : "rgba(148, 163, 184, 0.15)";
        ctx.lineWidth = alt === 0 ? 1.5 : 1;
        ctx.stroke();

        if (alt > 0) {
          ctx.font = "10px monospace";
          ctx.fillStyle = "rgba(148, 163, 184, 0.4)";
          ctx.textAlign = "center";
          ctx.fillText(label, centerX, centerY - r + 12);
        }
      });
      ctx.setLineDash([]);

      // Eixos Cardinais
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ponto Central (Zênite - 90°)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 240, 255, 0.8)";
      ctx.fill();

      ctx.font = "10px monospace";
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.textAlign = "left";
      ctx.fillText("Zênite (90°)", centerX + 6, centerY - 6);

      // Rótulos Cardinais (Projeção Celeste: Norte ao topo, Leste à esquerda, Oeste à direita)
      const cardinals = [
        { label: "N", sub: "0°", x: centerX, y: centerY - radius - 14 },
        { label: "S", sub: "180°", x: centerX, y: centerY + radius + 22 },
        { label: "L", sub: "90°", x: centerX - radius - 18, y: centerY + 4 },
        { label: "O", sub: "270°", x: centerX + radius + 18, y: centerY + 4 },
      ];

      cardinals.forEach(({ label, sub, x, y }) => {
        ctx.font = "bold 13px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "rgba(0, 240, 255, 0.9)";
        ctx.textAlign = "center";
        ctx.fillText(label, x, y);

        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(148, 163, 184, 0.5)";
        ctx.fillText(sub, x, y + 10);
      });

      // Conversão Azimute/Altitude para coordenadas Cartesianas do Canvas
      // Azimute: 0=N (topo), 90=L (esquerda na projeção celeste), 180=S (baixo), 270=O (direita)
      const toCanvasCoords = (alt: number, az: number) => {
        const clampedAlt = Math.max(0, Math.min(90, alt));
        const r = radius * (1 - clampedAlt / 90);
        // Radianos: 0° azimute é -PI/2 (topo). Leste (90°) à esquerda: ângulo = -PI/2 - az*PI/180
        const angleRad = -Math.PI / 2 - (az * Math.PI) / 180;
        return {
          x: centerX + r * Math.cos(angleRad),
          y: centerY + r * Math.sin(angleRad),
        };
      };

      // Plotagem dos planetas visíveis
      planetas.forEach((p) => {
        const { x, y } = toCanvasCoords(p.altitude_graus, p.azimute_graus);

        // Pulso suave
        const pulseSize = 6 + Math.sin(pulse) * 1.5;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, pulseSize * 2.5);
        glow.addColorStop(0, "rgba(0, 240, 255, 0.8)");
        glow.addColorStop(0.5, "rgba(0, 240, 255, 0.2)");
        glow.addColorStop(1, "rgba(0, 240, 255, 0)");

        ctx.beginPath();
        ctx.arc(x, y, pulseSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Núcleo do corpo celeste
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rótulo
        ctx.font = "bold 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "#f1f5f9";
        ctx.textAlign = "center";
        ctx.fillText(p.nome, x, y - 8);

        ctx.font = "9px monospace";
        ctx.fillStyle = "rgba(0, 240, 255, 0.75)";
        ctx.fillText(`${p.altitude_graus.toFixed(0)}°`, x, y + 14);
      });

      // Plotagem da Lua (se informada)
      if (faseLuaGraus >= 0) {
        // Posição aproximada ilustrativa se não tiver coordenadas próprias
        const luaAlt = 45;
        const luaAz = (faseLuaGraus * 0.9) % 360;
        const { x, y } = toCanvasCoords(luaAlt, luaAz);

        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "#fef08a";
        ctx.shadowColor = "#fef08a";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.font = "bold 11px 'Space Grotesk', sans-serif";
        ctx.fillStyle = "#fef08a";
        ctx.textAlign = "center";
        ctx.fillText(`Lua (${faseLuaNome})`, x, y - 10);
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [planetas, faseLuaGraus, faseLuaNome]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full max-w-[480px] aspect-square rounded-2xl cosmic-glass border border-space-border/80 p-4 shadow-cosmic-md">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Legenda de Rodapé do Radar */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-space-text-muted border-t border-space-border/40 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-nebula-cyan animate-pulse" />
            <span>Radar Polar Horizontal</span>
          </div>
          <span>Projeção Zênite Local</span>
        </div>
      </div>
    </div>
  );
}
