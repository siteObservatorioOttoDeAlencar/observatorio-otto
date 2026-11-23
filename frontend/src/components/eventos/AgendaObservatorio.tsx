import * as React from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, Users, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RichText } from "@/components/content/RichText";
import { midiaPopulada, urlDaMidia } from "@/lib/cms/media";
import { urlSegura } from "@/components/content/RichText";
import type { EventoCms, SituacaoEvento, TipoEvento } from "@/types/cms";

const ROTULO_TIPO: Record<TipoEvento, string> = {
  observacao: "Observação",
  oficina: "Oficina",
  palestra: "Palestra",
  visita: "Visita",
};

const ROTULO_SITUACAO: Record<SituacaoEvento, string> = {
  agendado: "Agendado",
  realizado: "Realizado",
  cancelado: "Cancelado",
};

const FUSO = "America/Fortaleza";

/** "5 de dezembro de 2026, 18:00" — sempre no horário de Fortaleza. */
export function formatarQuando(inicio: string, fim?: string | null): string {
  const dia = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: FUSO });
  const hora = new Intl.DateTimeFormat("pt-BR", { timeStyle: "short", timeZone: FUSO });
  const ini = new Date(inicio);
  if (Number.isNaN(ini.getTime())) return "";
  const base = `${dia.format(ini)}, ${hora.format(ini)}`;
  if (!fim) return base;
  const f = new Date(fim);
  if (Number.isNaN(f.getTime())) return base;
  return dia.format(f) === dia.format(ini)
    ? `${base} às ${hora.format(f)}`
    : `${base} até ${dia.format(f)}, ${hora.format(f)}`;
}

function CartaoEvento({ ev }: { ev: EventoCms }) {
  const fotos = (ev.fotos ?? []).map(midiaPopulada).filter((m) => m && urlDaMidia(m));
  const link = ev.situacao === "agendado" ? urlSegura(ev.linkInscricao) : null;

  return (
    <article className="cosmic-glass rounded-2xl p-6 sm:p-8 border border-space-border/80 hover:border-nebula-cyan/40 transition-all space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="subtle" className="text-nebula-cyan border-nebula-cyan/30 text-xs">
          {ROTULO_TIPO[ev.tipo] ?? ev.tipo}
        </Badge>
        <Badge variant={ev.situacao === "cancelado" ? "danger" : ev.situacao === "realizado" ? "outline" : "visible"}>
          {ROTULO_SITUACAO[ev.situacao] ?? ev.situacao}
        </Badge>
      </div>

      <h3 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver">{ev.titulo}</h3>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-space-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-nebula-cyan" />
          {formatarQuando(ev.inicio, ev.fim)}
        </span>
        {ev.local && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-nebula-cyan" />
            {ev.local}
          </span>
        )}
        {ev.publicoAlvo && (
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-nebula-cyan" />
            {ev.publicoAlvo}
          </span>
        )}
      </div>

      <RichText dados={ev.descricao} className="text-sm text-lunar-silver/85 leading-relaxed" />

      {ev.situacao === "realizado" && ev.relato && (
        <div className="rounded-xl border border-space-border/60 p-4 space-y-2">
          <p className="text-xs font-mono text-nebula-cyan">Relato do evento</p>
          <RichText dados={ev.relato} className="text-sm text-lunar-silver/85 leading-relaxed" />
        </div>
      )}

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {fotos.map((foto) => (
            <figure key={foto!.id} className="space-y-1">
              <img
                src={urlDaMidia(foto)!}
                alt={foto!.alt || ev.titulo}
                loading="lazy"
                className="w-full h-32 object-cover rounded-lg border border-white/[0.08]"
              />
              {(foto!.legenda || foto!.credito) && (
                <figcaption className="text-[11px] text-space-text-muted">
                  {foto!.legenda}
                  {foto!.credito ? ` — ${foto!.credito}` : ""}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {link && (
        <div className="pt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-nebula-cyan hover:underline"
          >
            <span>Inscrever-se</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}

/**
 * Agenda do observatório (observações públicas, oficinas, palestras e visitas),
 * publicada no CMS. `eventos === null` significa que o CMS não respondeu.
 */
export function AgendaObservatorio({ eventos }: { eventos: EventoCms[] | null }) {
  const agora = Date.now();
  const lista = eventos ?? [];
  const proximos = lista.filter((e) => e.situacao === "agendado" && new Date(e.inicio).getTime() >= agora);
  const anteriores = lista
    .filter((e) => !proximos.includes(e))
    .sort((a, b) => new Date(b.inicio).getTime() - new Date(a.inicio).getTime());

  return (
    <section className="space-y-8" aria-labelledby="agenda-titulo">
      <div className="border-b border-space-border/60 pb-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-nebula-cyan mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>AGENDA DO OBSERVATÓRIO</span>
        </div>
        <h1 id="agenda-titulo" className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-lunar-silver">
          Eventos
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-space-text-muted max-w-2xl">
          Observações públicas, oficinas, palestras e visitas ao Observatório Otto de Alencar.
        </p>
      </div>

      {eventos === null && (
        <div role="status" className="rounded-2xl border border-stellar-amber/30 bg-stellar-amber/10 p-5 text-sm text-lunar-silver/90">
          <div className="flex items-center gap-2 font-medium">
            <Clock className="h-4 w-4 text-stellar-amber" />
            <span>A agenda está temporariamente indisponível.</span>
          </div>
          <p className="mt-1 text-xs text-space-text-muted">
            Tente novamente em instantes ou{" "}
            <Link href="/contato" className="text-nebula-cyan underline">
              fale com a equipe
            </Link>{" "}
            para saber as próximas atividades.
          </p>
        </div>
      )}

      {eventos !== null && lista.length === 0 && (
        <p className="text-sm text-space-text-muted">
          Nenhum evento publicado no momento. Volte em breve ou{" "}
          <Link href="/contato" className="text-nebula-cyan underline">
            fale com a equipe
          </Link>
          .
        </p>
      )}

      {proximos.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-display text-lg font-semibold text-lunar-silver">Próximos eventos</h2>
          {proximos.map((ev) => (
            <CartaoEvento key={ev.id} ev={ev} />
          ))}
        </div>
      )}

      {anteriores.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-display text-lg font-semibold text-lunar-silver">Eventos anteriores</h2>
          {anteriores.map((ev) => (
            <CartaoEvento key={ev.id} ev={ev} />
          ))}
        </div>
      )}
    </section>
  );
}
