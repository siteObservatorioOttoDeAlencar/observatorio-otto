import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { inter, spaceGrotesk, jetbrainsMono } from "@/lib/fonts";
import { Providers } from "./providers";
import { OBSERVATORIO_CONFIG } from "@/lib/constants";

export const viewport: Viewport = {
  themeColor: "#080B10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: `${OBSERVATORIO_CONFIG.NOME} — Fortaleza, Ceará`,
    template: `%s | ${OBSERVATORIO_CONFIG.NOME}`,
  },
  description:
    "Portal oficial do Observatório Digital Otto de Alencar. Consulte o céu noturno em tempo real, fases da lua, posições planetárias, notícias e registre suas observações.",
  keywords: [
    "Astronomia",
    "Observatório Otto de Alencar",
    "Fortaleza",
    "Ceará",
    "Efemérides",
    "Céu Noturno",
    "Planetas Visíveis",
    "Astrofotografia",
  ],
  authors: [{ name: "Observatório Otto de Alencar" }],
  creator: "Observatório Otto de Alencar",
  metadataBase: new URL("https://observatorio.instituicao.br"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://observatorio.instituicao.br",
    title: `${OBSERVATORIO_CONFIG.NOME} — Astronomia e Observações`,
    description: "Acompanhe em tempo real as efemérides astronômicas de Fortaleza e acervo científico.",
    siteName: OBSERVATORIO_CONFIG.NOME,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-space-background text-lunar-silver font-sans antialiased selection:bg-nebula-cyan/30 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
