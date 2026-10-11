import * as React from "react";
import Link from "next/link";
import { Sparkles, Clock, Eye, ArrowUpRight, Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/layout/Container";

interface ObjetoRecomendado {
  id: string;
  nome: string;
  categoria: string;
  horarioIdeal: string;
  dificuldade: "Fácil (A olho nu)" | "Moderado (Binóculo)" | "Avançado (Telescópio)";
  dificuldadeVariant: "visible" | "amber" | "cyan";
  descricao: string;
  imagemUrl: string;
  constelacao: string;
}

const OBJETOS_HOJE: ObjetoRecomendado[] = [
  {
    id: "jupiter-luas",
    nome: "Júpiter & Luas Galileanas",
    categoria: "Planeta Gigante Gasoso",
    horarioIdeal: "20:30 às 23:45",
    dificuldade: "Fácil (A olho nu)",
    dificuldadeVariant: "visible",
    descricao:
      "Visível como o ponto mais brilhante a leste. Com binóculos simples é possível distinguir os quatro satélites: Ío, Europa, Ganimedes e Calisto.",
    imagemUrl:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Touro",
  },
  {
    id: "nebulosa-orion",
    nome: "Grande Nebulosa de Órion (M42)",
    categoria: "Berçário Estelar",
    horarioIdeal: "21:00 às 02:00",
    dificuldade: "Moderado (Binóculo)",
    dificuldadeVariant: "cyan",
    descricao:
      "Uma das nebulosas mais brilhantes do céu, situada logo abaixo do Cinturão de Órion (Três Marias). Apresenta nuvem difusa espetacular.",
    imagemUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Órion",
  },
  {
    id: "pleiades-m45",
    nome: "Aglomerado das Plêiades (M45)",
    categoria: "Aglomerado Aberto",
    horarioIdeal: "19:45 às 01:15",
    dificuldade: "Fácil (A olho nu)",
    dificuldadeVariant: "visible",
    descricao:
      "Conhecido como as 'Sete Irmãs', reúne centenas de estrelas jovens azuladas envoltas em névoa de poeira cósmica refletora.",
    imagemUrl:
      "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Touro",
  },
  {
    id: "saturno-aneis",
    nome: "Saturno e Sistema de Anéis",
    categoria: "Planeta com Anéis",
    horarioIdeal: "Ao anoitecer até 22:00",
    dificuldade: "Avançado (Telescópio)",
    dificuldadeVariant: "amber",
    descricao:
      "Apresenta cor dourada estável. Telescópios com abertura a partir de 70mm revelam com nitidez a Divisão de Cassini e a lua Titã.",
    imagemUrl:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?q=80&w=1200&auto=format&fit=crop",
    constelacao: "Aquário",
  },
];

export function OQueObservarHojeSection() {
  return (
    <section className="py-20 sm:py-28 relative">
      <Container size="default">
        {/* Cabeçalho de Seção Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-nebula-cyan text-xs font-mono uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Janela de Visibilidade Local</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
              O Que Observar Esta Noite
            </h2>
            <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
              Alvos astronômicos em destaque selecionados por nossa equipe para as coordenadas de Fortaleza. Condições otimizadas para instrumentos amadores e profissionais.
            </p>
          </div>

          <Link
            href="/ceu-hoje"
            className="inline-flex items-center gap-2 text-sm font-semibold text-nebula-cyan hover:text-nebula-cyan/80 transition-colors group shrink-0"
          >
            <span>Ver radar completo de azimute</span>
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid Estilo Vercel / Cards Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OBJETOS_HOJE.map((item) => (
            <Card
              key={item.id}
              variant="interactive"
              padding="none"
              className="group overflow-hidden flex flex-col h-full border-space-border/70 hover:border-nebula-cyan/40"
            >
              {/* Imagem com Aspect Ratio 16:10 e Overlay Gradual */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-space-surface-2">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.imagemUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-surface-1 via-space-surface-1/30 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge variant={item.dificuldadeVariant}>{item.dificuldade}</Badge>
                  <span className="rounded bg-black/60 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-lunar-silver border border-white/10">
                    {item.constelacao}
                  </span>
                </div>
              </div>

              {/* Conteúdo do Card */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-nebula-cyan uppercase tracking-wider block">
                    {item.categoria}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                    {item.nome}
                  </h3>
                  <p className="text-xs text-space-text-muted leading-relaxed line-clamp-3">
                    {item.descricao}
                  </p>
                </div>

                <div className="pt-3 border-t border-space-border/50 flex items-center justify-between text-xs text-space-text-muted font-mono">
                  <span className="flex items-center gap-1.5 text-lunar-silver">
                    <Clock className="h-3.5 w-3.5 text-stellar-amber" />
                    {item.horarioIdeal}
                  </span>
                  <span className="flex items-center gap-1 text-nebula-cyan group-hover:underline">
                    Ver dados <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
