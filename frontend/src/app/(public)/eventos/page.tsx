import type { Metadata } from "next";
import { AgendaObservatorio } from "@/components/eventos/AgendaObservatorio";
import { FenomenosCelestes } from "@/components/eventos/FenomenosCelestes";
import { lerDoCms } from "@/lib/cms/server";
import type { EventoCms, PayloadList } from "@/types/cms";

export const metadata: Metadata = {
  title: "Eventos — Observatório Otto de Alencar",
  description:
    "Agenda de observações públicas, oficinas, palestras e visitas, e o calendário de fenômenos astronômicos.",
};

// Página estática renovada a cada 60 s com o que está publicado no CMS.
export const revalidate = 60;

export default async function EventosPage() {
  const resposta = await lerDoCms<PayloadList<EventoCms>>(
    "/api/eventos?sort=inicio&limit=50&depth=1",
  );

  return (
    <div className="py-6 sm:py-8 md:py-10 space-y-16 max-w-5xl mx-auto">
      <AgendaObservatorio eventos={resposta ? resposta.docs : null} />
      <FenomenosCelestes />
    </div>
  );
}
