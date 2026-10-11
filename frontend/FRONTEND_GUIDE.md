# Guia de Engenharia e Manutenção do Front-End 🛠️

> **Observatório Digital Otto de Alencar**  
> Este guia é o manual de cabeceira para qualquer desenvolvedor que precise manter, evoluir ou refatorar o Front-End da plataforma sem depender do autor original.

---

## 1. Onde Fica Cada Coisa? (Mapa Rápido)

| Elemento | Onde Encontrar | O que faz? |
|---|---|---|
| **Páginas e Rotas** | `src/app/(public)/` | Rotas como `/` (Home), `/ceu-hoje`, `/galeria`, `/conteudo`, `/sobre`, `/contato`. |
| **Seções da Home Page** | `src/components/home/` | Componentes que formam a Home: `HeroStatusCockpit`, `OQueObservarHojeHumanizado`, etc. |
| **Componentes Atômicos de UI** | `src/components/ui/` | Botões (`Button`), Cartões (`Card`), Tags (`Badge`), Abas (`Tabs`), Modais (`Modal`). |
| **Chamadas para a FastAPI** | `src/features/sky-today/services/` | `fastapiAstroService.ts` — Requisições HTTP para a API de cálculo astronômico. |
| **Chamadas para o Strapi CMS** | `src/features/content/services/` | `strapiContentService.ts` — Requisições para o painel de artigos e notícias. |
| **Hooks com Cache de Dados** | `src/features/*/hooks/` | Hooks TanStack Query como `useSkyToday()` e `useArticles()`. |
| **Configurações e URLs** | `src/lib/constants.ts` | Endereços padrão do backend e coordenadas de Fortaleza. |
| **Cores, Fontes e Efeitos** | `src/styles/globals.css` | Definição das variáveis CSS: `--space-background`, `--nebula-cyan`, etc. |

---

## 2. Como Alterar Estilos e Textos

### A. Para Alterar Textos Institucionais ou da Home:
* A Home é composta por blocos modulares em `src/components/home/`:
  * Para mudar o status ou título de boas-vindas: edite `HeroStatusCockpit.tsx`.
  * Para mudar as dicas de alvos e orientações simples: edite `OQueObservarHojeHumanizado.tsx`.
  * Para mudar as referências urbanas de Fortaleza (Praia do Futuro, etc.): edite `ParaOndeOlhar.tsx`.
  * Para mudar horários de sessões abertas de sábado: edite `ExperienciaRealObservatorio.tsx`.

### B. Para Alterar Cores e Temas:
* As cores do sistema seguem uma paleta espacial definida em `src/styles/globals.css`:
  * `space-background`: Preto espacial profundo (`#080B10`).
  * `space-surface-1` e `space-surface-2`: Camadas de cartões escuros com contraste.
  * `nebula-cyan`: Ciano de destaque tecnológico (`#38BDF8`).
  * `aurora-green`: Verde para status favorável e astros visíveis no céu (`#4ADE80`).
  * `stellar-amber`: Âmbar para alvos de destaque como a Lua e Saturno (`#F59E0B`).

---

## 3. Como Alterar a Integração com o Backend

### Se a URL do Backend Mudar:
Você **NUNCA** deve alterar URLs diretamente dentro dos componentes. A configuração é centralizada em 2 lugares:
1. **Ambiente Local/Produção:** no arquivo `.env.local` na raiz de `frontend/`:
   ```env
   NEXT_PUBLIC_FASTAPI_URL=https://api.observatorio.instituicao.ce
   NEXT_PUBLIC_STRAPI_URL=https://cms.observatorio.instituicao.ce
   ```
2. **Fallback Padrão:** no arquivo `src/lib/constants.ts` (caso a variável de ambiente não esteja definida).

### Como o Front-End se Protege Contra Quedas da API:
* Veja `src/features/sky-today/services/fastapiAstroService.ts`:
  * A chamada HTTP possui um `timeout: 2500` (2.5 segundos).
  * Se o backend estiver fora do ar ou demorar, a função aciona automaticamente um objeto `FALLBACK_ASTRO` seguro. A interface continua renderizando perfeitamente sem travar ou gerar erros vermelhos para o visitante.

---

## 4. Passo a Passo: Como Criar uma Nova Tela

Imagine que a equipe queira criar uma página de **Previsão do Tempo Noturno** (`/tempo`):

1. Crie a pasta `src/app/(public)/tempo/`.
2. Crie o arquivo `src/app/(public)/tempo/page.tsx`:
   ```tsx
   "use client";

   import React from "react";
   import { Container } from "@/components/layout/Container";
   import { CloudMoon } from "lucide-react";

   export default function PrevisaoTempoPage() {
     return (
       <div className="py-8 space-y-6">
         <Container size="default">
           <div className="flex items-center gap-3">
             <CloudMoon className="h-6 w-6 text-nebula-cyan" />
             <h1 className="font-display text-3xl font-bold text-white">
               Condições Atmosféricas e Seeing
             </h1>
           </div>
           <p className="text-space-text-muted text-sm mt-2">
             Previsão de nebulosidade e transparência para Fortaleza.
           </p>
         </Container>
       </div>
     );
   }
   ```
3. Adicione o link de navegação na Navbar:
   * Abra `src/components/layout/Navbar.tsx` e adicione ao array `NAV_ITEMS`.

---

## 5. Passo a Passo: Como Criar um Novo Componente

1. Se for um componente genérico (ex: um chip ou botão), crie em `src/components/ui/`.
2. Se for um componente com lógica astronômica ou de seção, crie na pasta correspondente.
3. Exemplo de Card Simples com Estilo do Observatório:
   ```tsx
   import React from "react";

   interface AstroCardProps {
     titulo: string;
     descricao: string;
     icone?: React.ReactNode;
   }

   export function AstroCard({ titulo, descricao, icone }: AstroCardProps) {
     return (
       <div className="rounded-2xl p-5 bg-space-surface-1 border border-white/[0.08] hover:border-nebula-cyan/40 transition-colors">
         <div className="flex items-center gap-3 mb-2">
           {icone && <div className="text-nebula-cyan">{icone}</div>}
           <h3 className="font-display font-bold text-white text-base">{titulo}</h3>
         </div>
         <p className="text-xs text-space-text-muted leading-relaxed">{descricao}</p>
       </div>
     );
   }
   ```

---

## 6. Padronizações Obrigatórias de Código

* **Nomes de Componentes:** Sempre em `PascalCase` (ex: `HeroStatusCockpit`, `GuiaPorEquipamento`).
* **Nomes de Hooks:** Sempre com o prefixo `use` (ex: `useSkyToday`, `useArticles`).
* **Nomes de Serviços:** Sempre terminados em `Service` (ex: `fastapiAstroService`, `strapiContentService`).
* **Estilização:** Preferir classes do Tailwind aos invés de blocos `<style>` inline.
* **Acessibilidade:** Botões e links interativos devem ter área de clique confortável (mínimo `40px` a `44px`) e contraste legível conforme as diretrizes do projeto.
