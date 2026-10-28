import * as React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-space-background selection:bg-nebula-cyan/20 selection:text-nebula-cyan overflow-x-clip">
      {/* Luz ambiente cósmica suave e repousante (Linear / Stripe style) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-20"
        aria-hidden="true"
      >
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-nebula-cyan/8 blur-[120px]" />
        <div className="absolute top-[50%] -left-[10%] w-[350px] h-[350px] rounded-full bg-stellar-amber/4 blur-[120px]" />
      </div>

      {/* Cabeçalho Fixo com Glassmorphism */}
      <Navbar />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1">
        {children}
      </main>

      {/* Rodapé com Informações de Observatório */}
      <Footer />
    </div>
  );
}
