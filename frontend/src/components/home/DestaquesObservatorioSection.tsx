import * as React from "react";
import Link from "next/link";
import { Telescope, Compass, Award, Users, ArrowUpRight, BookOpen, Layers } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Card, CardContent } from "@/components/ui/Card";

const DESTAQUES = [
  {
    titulo: "Telescópio Otto de Alencar",
    subtitulo: "Instrumentação Científica",
    descricao:
      "Equipamento principal de observação do observatório, dedicado ao registro fotométrico e monitoramento de estrelas variáveis e corpos do sistema solar.",
    icon: Telescope,
    link: "/sobre",
    tag: "Instrumento Óptico",
  },
  {
    titulo: "Pesquisa & Extensão Comunitária",
    subtitulo: "Disseminação da Astronomia",
    descricao:
      "Aulas de campo, oficinas de astrofotografia para jovens pesquisadores e sessões públicas de contemplação da lua e dos planetas aos finais de semana.",
    icon: Users,
    link: "/sobre",
    tag: "Extensão",
  },
  {
    titulo: "Acervo Histórico de Otto de Alencar",
    subtitulo: "Memória da Ciência no Ceará",
    descricao:
      "Preservação do legado matemático e astronômico de Otto de Alencar Silva, pioneiro nos cálculos geodésicos e análises de eclipses solares no Brasil.",
    icon: Award,
    link: "/sobre",
    tag: "Patrimônio Científico",
  },
  {
    titulo: "Banco de Efemérides Computacionais",
    subtitulo: "Engenharia de Software",
    descricao:
      "Algoritmos em Python e C integrados a modelos da NASA para gerar previsões de alta precisão sem dependência de conexões de internet externas.",
    icon: Layers,
    link: "/ceu-hoje",
    tag: "Tecnologia",
  },
];

export function DestaquesObservatorioSection() {
  return (
    <section className="py-20 sm:py-28 relative bg-space-surface-1/40 border-t border-space-border/50">
      <Container size="default">
        {/* Cabeçalho Editorial */}
        <div className="max-w-3xl mb-14 sm:mb-20 space-y-4">
          <span className="font-mono text-xs uppercase tracking-widest text-nebula-cyan block">
            Pilar Acadêmico & Extensão
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-lunar-silver">
            Excelência Científica & Compromisso Social
          </h2>
          <p className="text-space-text-muted text-sm sm:text-base leading-relaxed">
            O Observatório Digital Otto de Alencar une a vanguarda computacional ao ensino público, aproximando a sociedade das maravilhas do cosmos através de dados abertos.
          </p>
        </div>

        {/* Grid Editorial Premium */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {DESTAQUES.map((destaque) => {
            const Icon = destaque.icon;
            return (
              <Link key={destaque.titulo} href={destaque.link} className="group block">
                <Card
                  variant="interactive"
                  className="h-full p-8 border-space-border/70 group-hover:border-nebula-cyan/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-space-surface-2 border border-space-border/80 flex items-center justify-center text-nebula-cyan group-hover:scale-105 transition-transform cosmic-glow">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-[11px] text-space-text-muted border border-space-border rounded-full px-2.5 py-0.5 bg-space-surface-2">
                        {destaque.tag}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-mono text-nebula-cyan uppercase tracking-wider block">
                        {destaque.subtitulo}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                        {destaque.titulo}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-space-text-muted leading-relaxed">
                      {destaque.descricao}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-space-border/40 mt-6 flex items-center justify-between text-xs font-semibold text-lunar-silver group-hover:text-nebula-cyan transition-colors">
                    <span>Conhecer detalhes</span>
                    <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
