"use client";

import * as React from "react";
import { ErrorMessage } from "@/components/feedback/ErrorMessage";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto p-12 flex justify-center">
      <ErrorMessage message={error.message || "Erro inesperado na aplicação."} onRetry={reset} />
    </div>
  );
}
