import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Telescope } from "lucide-react";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  variant?: "fullscreen" | "inline" | "card";
}

export function LoadingState({
  message = "Consultando efemérides celestes...",
  variant = "inline",
  className,
  ...props
}: LoadingStateProps) {
  const containerClasses = {
    fullscreen: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-space-background/80 backdrop-blur-md",
    inline: "flex flex-col items-center justify-center p-8",
    card: "flex flex-col items-center justify-center p-12 cosmic-glass rounded-2xl border border-space-border/60",
  };

  return (
    <div className={cn(containerClasses[variant], className)} role="status" aria-live="polite" {...props}>
      <div className="relative flex items-center justify-center mb-4">
        {/* Órbita externa animada */}
        <div className="h-14 w-14 rounded-full border-2 border-nebula-cyan/20 border-t-nebula-cyan animate-spin" />
        {/* Ícone astronômico central */}
        <div className="absolute flex items-center justify-center">
          <Telescope className="h-6 w-6 text-nebula-cyan animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-lunar-silver">{message}</p>
      <span className="sr-only">Carregando conteúdo</span>
    </div>
  );
}
