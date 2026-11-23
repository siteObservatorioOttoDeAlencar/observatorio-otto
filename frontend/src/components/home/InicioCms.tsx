import * as React from "react";
import { Container } from "@/components/layout/Container";
import { RichText } from "@/components/content/RichText";
import { lerDoCms } from "@/lib/cms/server";
import { midiaPopulada, urlDaMidia } from "@/lib/cms/media";
import type { InicioCms as InicioCmsDados } from "@/types/cms";

// Conteúdo de reserva: exibido quando o CMS não responde ou a página Início ainda não foi publicada.
const TITULO_RESERVA = "Observatório Digital Otto de Alencar";
const TEXTO_RESERVA =
  "Projeto de extensão da UECE que aproxima a astronomia do público. " +
  "Veja abaixo o que observar no céu de Fortaleza hoje à noite.";

/** Apresentação da página inicial, editada no CMS (global "Início"). */
export async function InicioCms() {
  const inicio = await lerDoCms<InicioCmsDados>("/api/globals/inicio?depth=1");
  const titulo = inicio?.titulo?.trim() || null;
  const destaques = (inicio?.destaques ?? [])
    .map(midiaPopulada)
    .filter((m): m is NonNullable<typeof m> => Boolean(m && urlDaMidia(m)));

  return (
    <section className="py-10 sm:py-14 border-b border-white/[0.08] bg-space-background">
      <Container size="narrow">
        <div className="space-y-5">
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
            {titulo ?? TITULO_RESERVA}
          </h2>

          {titulo && inicio?.apresentacao ? (
            <RichText
              dados={inicio.apresentacao}
              className="text-sm sm:text-base text-space-text-muted leading-relaxed"
            />
          ) : (
            <p className="text-sm sm:text-base text-space-text-muted leading-relaxed">{TEXTO_RESERVA}</p>
          )}

          {destaques.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {destaques.map((m) => (
                <figure key={m.id} className="space-y-1.5">
                  <img
                    src={urlDaMidia(m)!}
                    alt={m.alt || ""}
                    loading="lazy"
                    className="w-full h-44 object-cover rounded-xl border border-white/[0.08]"
                  />
                  {(m.legenda || m.credito) && (
                    <figcaption className="text-[11px] text-space-text-muted">
                      {m.legenda}
                      {m.credito ? ` — ${m.credito}` : ""}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
