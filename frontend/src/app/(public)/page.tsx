import * as React from "react";
import type { Metadata } from "next";
import { HeroStatusCockpit } from "@/components/home/HeroStatusCockpit";
import { InicioCms } from "@/components/home/InicioCms";
import { OQueObservarHojeHumanizado } from "@/components/home/OQueObservarHojeHumanizado";
import { GuiaPorEquipamento } from "@/components/home/GuiaPorEquipamento";
import { ParaOndeOlhar } from "@/components/home/ParaOndeOlhar";
import { ExperienciaRealObservatorio } from "@/components/home/ExperienciaRealObservatorio";
import { ArtigosStripeBlog } from "@/components/home/ArtigosStripeBlog";
import { CtaLinear } from "@/components/home/CtaLinear";

export const metadata: Metadata = {
  title: "O Céu Hoje em Fortaleza — Observatório Otto de Alencar",
  description:
    "Descubra em segundos o que vale a pena observar no céu de Fortaleza hoje à noite. Planetas visíveis a olho nu, fase da Lua, melhores horários e sessões públicas no observatório.",
};

// Página estática renovada a cada 60 s com o conteúdo publicado no CMS.
export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-space-background selection:bg-nebula-cyan/20 selection:text-nebula-cyan">
      {/* 1. Status do Céu Agora (Hero dos 5 Segundos): "Vale a pena olhar para o céu hoje?" */}
      <HeroStatusCockpit />

      {/* 1b. Apresentação editável no CMS (global "Início"); usa texto de reserva se o CMS não responder */}
      <InicioCms />

      {/* 2. O Que Vale a Pena Observar Hoje: Os 3 melhores alvos com Modo Simples e Modo Técnico */}
      <OQueObservarHojeHumanizado />

      {/* 3. O Que Eu Consigo Ver Com o Que Tenho: Filtro por Olho Nu, Binóculo ou Telescópio */}
      <GuiaPorEquipamento />

      {/* 4. Para Onde Olhar: Orientação espacial humana (Leste, Oeste, Alto da Cabeça) */}
      <ParaOndeOlhar />

      {/* 5. Experiência Real: Convite para as sessões públicas gratuitas de sábado no Observatório */}
      <ExperienciaRealObservatorio />

      {/* 6. Conteúdo Complementar: Artigos científicos, história de Otto de Alencar e pesquisa */}
      <ArtigosStripeBlog />

      {/* 7. Alerta Noturno: Boletim de efemérides semanais sem ruído */}
      <CtaLinear />
    </div>
  );
}
