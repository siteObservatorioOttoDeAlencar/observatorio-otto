import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import { RichText, textoPuro, urlSegura } from "./RichText";
import type { LexicalState } from "@/types/cms";

const texto = (text: string, format = 0) => ({ type: "text", text, format });

const exemplo: LexicalState = {
  root: {
    type: "root",
    children: [
      { type: "heading", tag: "h2", children: [texto("Título")] },
      {
        type: "paragraph",
        children: [
          texto("Olá "),
          texto("negrito", 1),
          texto(" e "),
          texto("itálico", 2),
          { type: "linebreak" },
          {
            type: "link",
            fields: { url: "https://exemplo.org", newTab: true },
            children: [texto("link seguro")],
          },
          texto(" "),
          {
            type: "link",
            fields: { url: "javascript:alert(1)" },
            children: [texto("link perigoso")],
          },
        ],
      },
      {
        type: "list",
        listType: "bullet",
        children: [{ type: "listitem", children: [texto("item um")] }],
      },
      { type: "upload", value: { id: 1 } },
    ],
  },
};

describe("RichText (Lexical do Payload)", () => {
  it("renderiza títulos, formatação, listas e ignora nós desconhecidos", () => {
    const { container } = render(<RichText dados={exemplo} />);
    expect(screen.getByRole("heading", { level: 2, name: "Título" })).toBeInTheDocument();
    expect(container.querySelector("strong")?.textContent).toBe("negrito");
    expect(container.querySelector("em")?.textContent).toBe("itálico");
    expect(container.querySelectorAll("li")).toHaveLength(1);
  });

  it("mantém links http(s) e remove o href de links javascript:", () => {
    const { container } = render(<RichText dados={exemplo} />);
    const links = Array.from(container.querySelectorAll("a"));
    // Só o link seguro vira <a>; o texto do perigoso continua visível, mas sem href
    expect(links.map((a) => a.textContent)).toEqual(["link seguro"]);
    expect(links[0]).toHaveAttribute("href", "https://exemplo.org");
    expect(links[0]).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(container.textContent).toContain("link perigoso");
    expect(container.innerHTML).not.toContain("javascript:");
  });

  it("não renderiza nada quando não há conteúdo", () => {
    const { container } = render(<RichText dados={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("urlSegura só aceita http(s), mailto, relativas e âncoras", () => {
    expect(urlSegura("https://a.org")).toBe("https://a.org");
    expect(urlSegura("/conteudo")).toBe("/conteudo");
    expect(urlSegura("mailto:a@b.c")).toBe("mailto:a@b.c");
    expect(urlSegura("javascript:alert(1)")).toBeNull();
    expect(urlSegura("data:text/html,x")).toBeNull();
    expect(urlSegura(undefined)).toBeNull();
  });

  it("textoPuro extrai o texto de todos os nós", () => {
    expect(textoPuro(exemplo)).toContain("Título Olá negrito e itálico");
    expect(textoPuro(null)).toBe("");
  });
});
