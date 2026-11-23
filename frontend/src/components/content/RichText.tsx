import * as React from "react";
import type { LexicalNode, LexicalState } from "@/types/cms";

/**
 * Renderiza o texto rico do Payload (Lexical em JSON) como elementos React.
 *
 * - Não usa `dangerouslySetInnerHTML`: todo texto passa pelo React (escapado).
 * - Links só aceitam http(s), mailto e caminhos relativos (bloqueia `javascript:`).
 * - Nós desconhecidos (uploads, blocos…) são ignorados sem quebrar a página.
 */

// Máscara de formatação do Lexical
const NEGRITO = 1;
const ITALICO = 2;
const TACHADO = 4;
const SUBLINHADO = 8;
const CODIGO = 16;

const TAGS_TITULO = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

export function urlSegura(url: string | undefined | null): string | null {
  if (!url) return null;
  const limpa = url.trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(limpa)) return limpa;
  return null;
}

function renderTexto(no: LexicalNode, chave: React.Key): React.ReactNode {
  const formato = typeof no.format === "number" ? no.format : 0;
  let conteudo: React.ReactNode = no.text ?? "";
  if (formato & CODIGO) conteudo = <code>{conteudo}</code>;
  if (formato & NEGRITO) conteudo = <strong>{conteudo}</strong>;
  if (formato & ITALICO) conteudo = <em>{conteudo}</em>;
  if (formato & TACHADO) conteudo = <s>{conteudo}</s>;
  if (formato & SUBLINHADO) conteudo = <u>{conteudo}</u>;
  return <React.Fragment key={chave}>{conteudo}</React.Fragment>;
}

function renderNos(nos: LexicalNode[] | undefined): React.ReactNode[] {
  return (nos ?? []).map((no, i) => renderNo(no, i));
}

function renderNo(no: LexicalNode, chave: React.Key): React.ReactNode {
  switch (no.type) {
    case "text":
      return renderTexto(no, chave);
    case "linebreak":
      return <br key={chave} />;
    case "paragraph":
      return (
        <p key={chave} className="mb-4 last:mb-0">
          {renderNos(no.children)}
        </p>
      );
    case "heading": {
      const tag = TAGS_TITULO.has(no.tag ?? "") ? (no.tag as "h2") : "h2";
      return React.createElement(
        tag,
        { key: chave, className: "font-display font-bold text-lunar-silver mt-6 mb-3" },
        renderNos(no.children),
      );
    }
    case "quote":
      return (
        <blockquote key={chave} className="border-l-4 border-nebula-cyan pl-4 italic my-4">
          {renderNos(no.children)}
        </blockquote>
      );
    case "list": {
      const Lista = no.listType === "number" ? "ol" : "ul";
      const estilo = no.listType === "number" ? "list-decimal" : "list-disc";
      return (
        <Lista key={chave} className={`${estilo} pl-6 mb-4 space-y-1`}>
          {renderNos(no.children)}
        </Lista>
      );
    }
    case "listitem":
      return <li key={chave}>{renderNos(no.children)}</li>;
    case "link":
    case "autolink": {
      const href = urlSegura(no.fields?.url ?? no.url);
      if (!href) return <React.Fragment key={chave}>{renderNos(no.children)}</React.Fragment>;
      const externo = /^https?:\/\//i.test(href);
      return (
        <a
          key={chave}
          href={href}
          className="text-nebula-cyan underline hover:no-underline"
          {...(no.fields?.newTab || externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {renderNos(no.children)}
        </a>
      );
    }
    default:
      return null;
  }
}

export function RichText({
  dados,
  className,
}: {
  dados: LexicalState | null | undefined;
  className?: string;
}) {
  const filhos = dados?.root?.children;
  if (!filhos || filhos.length === 0) return null;
  return <div className={className}>{renderNos(filhos)}</div>;
}

/** Texto puro do conteúdo rico (para estimar tempo de leitura e resumos). */
export function textoPuro(dados: LexicalState | null | undefined): string {
  const partes: string[] = [];
  const percorrer = (nos: LexicalNode[] | undefined) => {
    for (const no of nos ?? []) {
      if (no.type === "text" && no.text) partes.push(no.text);
      percorrer(no.children);
    }
  };
  percorrer(dados?.root?.children);
  return partes.join(" ").replace(/\s+/g, " ").trim();
}
