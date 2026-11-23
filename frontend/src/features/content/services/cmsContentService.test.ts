import { describe, it, expect } from "vitest";
import { noticiaParaArtigo, tempoDeLeitura } from "./cmsContentService";
import { urlDaMidia } from "@/lib/cms/media";
import type { NoticiaCms } from "@/types/cms";

const base: NoticiaCms = {
  id: 1,
  titulo: "Otto de Alencar e Sobral",
  slug: "otto-sobral",
  resumo: "Um resumo curto.",
  categoria: "historia-da-ciencia",
  autor: null,
  dataPublicacao: "2026-10-02T10:30:00.000Z",
};

describe("noticiaParaArtigo", () => {
  it("traduz a categoria para o rótulo e usa valores padrão", () => {
    const artigo = noticiaParaArtigo(base);
    expect(artigo.categoria).toBe("História da Ciência");
    expect(artigo.autor).toBe("Equipe do Observatório");
    expect(artigo.publicadoEm).toBe(base.dataPublicacao);
    expect(artigo.capaUrl).toBeNull();
  });

  it("usa 'Astronomia' quando não há categoria", () => {
    expect(noticiaParaArtigo({ ...base, categoria: null }).categoria).toBe("Astronomia");
  });

  it("monta a URL da capa quando a mídia veio populada", () => {
    const artigo = noticiaParaArtigo({
      ...base,
      capa: { id: 9, url: "https://store.public.blob.vercel-storage.com/capa.png", alt: "Capa" },
    });
    expect(artigo.capaUrl).toBe("https://store.public.blob.vercel-storage.com/capa.png");
  });
});

describe("tempoDeLeitura", () => {
  it("arredonda por 200 palavras/min com mínimo de 1 min", () => {
    expect(tempoDeLeitura("poucas palavras")).toBe("1 min");
    expect(tempoDeLeitura(Array(1000).fill("palavra").join(" "))).toBe("5 min");
  });
});

describe("urlDaMidia", () => {
  it("completa caminhos relativos com a URL do CMS (dev local)", () => {
    expect(urlDaMidia({ id: 1, url: "/api/media/file/a.png" })).toBe(
      "http://localhost:3000/api/media/file/a.png",
    );
  });

  it("ignora relação não populada (só o id) e mídia sem URL", () => {
    expect(urlDaMidia(5)).toBeNull();
    expect(urlDaMidia(null)).toBeNull();
    expect(urlDaMidia({ id: 2, url: null })).toBeNull();
  });
});
