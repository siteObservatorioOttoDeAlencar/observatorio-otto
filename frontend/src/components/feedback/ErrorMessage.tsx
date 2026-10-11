import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = "Ocorreu um erro ao carregar as informações do observatório.",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center cosmic-glass rounded-xl border border-crimson-deep/40">
      <div className="rounded-full bg-crimson-deep/10 p-3 text-crimson-deep mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="text-sm text-lunar-silver max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 gap-2">
          <RotateCcw className="h-4 w-4" />
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
