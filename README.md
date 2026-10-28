# Observatório Digital Otto de Alencar 🔭✨

> Uma plataforma web moderna, aberta e acessível que responde em menos de 5 segundos se vale a pena olhar para o céu de Fortaleza hoje à noite, para onde olhar e o que você consegue ver com o que tem à mão.

---

## O Que É Este Projeto?

O **Observatório Digital Otto de Alencar** é um projeto de extensão universitária e divulgação científica sediado em Fortaleza, Ceará. 

Ele nasceu com um propósito muito claro: **aproximar a astronomia do público em geral**. 

### Para Quem Foi Criado?
- **Curiosos e Famílias:** Pessoas que querem saber se o céu está bonito hoje para ver com os filhos ou da janela de casa.
- **Estudantes e Professores:** Escolas que desejam acompanhar fenômenos celestes e agendar visitas ao telescópio do observatório.
- **Astrônomos Amadores:** Observadores que possuem lunetas ou telescópios e precisam de coordenadas precisas calculadas para a latitude de Fortaleza.

### Qual Problema Ele Resolve?
Muitos sites de astronomia são acadêmicos demais, cheios de números difíceis (como altitude, azimute e fórmulas) ou parecem manuais antigos. O usuário comum só quer saber: *"O que é aquela luz brilhante no céu? Preciso de telescópio? Para onde eu olho?"*. 

Este projeto traduz cálculos matemáticos e da NASA em **linguagem humana**, orientações práticas e recursos visuais intuitivos.

---

## Visão Geral

Ao entrar no site, qualquer pessoa consegue:

1. **Saber se o céu está bom em 1 segundo:** O topo da página avisa se as condições estão favoráveis e qual o melhor horário da noite.
2. **Descobrir os destaques de hoje:** Cartões simples mostram se os planetas (como Júpiter e Saturno) e a Lua estão visíveis.
3. **Alternar entre Modo Simples e Modo Técnico:** 
   - O *Modo Simples* diz: *"Olhe para o Leste (onde o Sol nasce) a meia altura"*.
   - O *Modo Técnico* mostra: *Altitude +52.8°, Azimute 78.4°, Magnitude -2.5*.
4. **Filtrar pelo que você tem em casa:** Abas dedicadas mostram o que dá para ver **A Olho Nu**, com um **Binóculo Comum** ou com um **Telescópio**.
5. **Agendar visitas gratuitas:** Informações sobre as sessões abertas de sábado com o telescópio principal de 11 polegadas.
6. **Ler artigos científicos e históricos:** Ensaios sobre astrofísica e o papel histórico de Otto de Alencar no teste da Teoria da Relatividade em Sobral (1919).

---

## Tecnologias Utilizadas (Em Linguagem Humana)

Aqui você não precisa ser especialista para entender. Cada ferramenta tem um papel bem definido:

* **Next.js (v14):** O maestro do front-end. Ele cuida da criação das páginas, das rotas e garante que o site carregue muito rápido.
* **TypeScript:** Uma camada de segurança sobre o JavaScript. Ele avisa se você tentar passar um texto onde deveria ser um número, evitando bugs bobos.
* **Tailwind CSS:** O estilista da interface. Em vez de escrever arquivos CSS gigantes, usamos classes práticas direto nos componentes (como `p-4` para espaçamento ou `text-white` para cor branca).
* **TanStack Query (React Query):** O mensageiro de dados. Ele busca as informações do backend, guarda em cache (memória temporária) e atualiza a tela sem recarregar a página.
* **Framer Motion:** O animador sutil. Adiciona transições suaves e elegantes quando os cards aparecem na tela.
* **FastAPI (Backend em Python):** O cérebro matemático. Ele usa bibliotecas astronômicas de alta precisão (Skyfield) para calcular onde os planetas estão no céu de Fortaleza neste exato segundo.
* **Strapi CMS (Gerenciador de Conteúdo):** O painel do professor. Um painel fácil onde a equipe editorial escreve notícias e artigos sem precisar encostar no código.

---

## Executar o backend com Docker

Configure o arquivo `.env` na raiz seguindo as instruções de [backend/README.md](backend/README.md). Na raiz do repositório, inicie os serviços:

```bash
docker compose --env-file .env -f backend/docker-compose.yml up --build
```

Na primeira inicialização, o Strapi pode levar alguns minutos para iniciar enquanto configura o ambiente. Para acompanhar os logs:

```bash
docker compose --env-file .env -f backend/docker-compose.yml logs -f
```

Os serviços ficam disponíveis em:

| Serviço | Endereço |
| --- | --- |
| Painel administrativo do Strapi | http://localhost:1337/admin |
| API do Strapi | http://localhost:1337 |
| API FastAPI | http://localhost:8000 |
| Documentação interativa FastAPI | http://localhost:8000/docs |
| Verificação da API FastAPI | http://localhost:8000/health |
| PostgreSQL | `localhost:5432` |

No primeiro acesso a `/admin`, crie a conta de administrador do Strapi.

### Endpoints da API FastAPI

- `GET /health`: verifica se a API está respondendo.
- `GET /observar-hoje`: retorna informações astronômicas para a localização configurada, incluindo fase atual (Nova, Crescente, Cheia ou Minguante), porcentagem iluminada da Lua e nome/data UTC da próxima fase diferente da atual. Na primeira chamada, o Skyfield pode baixar o arquivo de efemérides `de421.bsp`.
- `POST /registros-observacao`: exemplo de rota protegida por JWT do Strapi; a gravação do registro ainda não está implementada.

## Encerrar e persistência dos dados

Para parar os containers:

```bash
docker compose --env-file .env -f backend/docker-compose.yml down
```

Os dados do PostgreSQL e os uploads do Strapi ficam em volumes Docker e são preservados ao parar os serviços. Para apagá-los também, use `docker compose --env-file .env -f backend/docker-compose.yml down -v`; isso exclui os dados persistidos.

## Estrutura do Front-end

Dentro da pasta `frontend/src/`, o código é organizado de forma lógica:


```text
frontend/src/
├── app/                    # 📄 As Páginas do Sistema (Next.js App Router)
│   ├── (public)/           # Páginas abertas (Home, O Céu Hoje, Galeria, Artigos, Contato)
│   ├── (auth)/             # Telas de Login e Cadastro
│   └── (authenticated)/    # Painel interno do astrônomo e novos registros de observação
│
├── components/             # 🧱 Os Tijolos Visuais da Interface
│   ├── astronomy/          # Componentes específicos de astronomia (badges, ícones da lua)
│   ├── home/               # Seções que compõem a página inicial
│   ├── layout/             # Barra de navegação do topo (Navbar), Rodapé (Footer) e Container
│   └── ui/                 # Componentes básicos reaproveitáveis (Botões, Cards, Badges, Modais)
│
├── features/               # 📦 Funcionalidades Completas com Lógica de Dados
│   ├── sky-today/          # Lógica do "Céu Hoje" (hooks, serviços e cálculos)
│   └── content/            # Lógica dos artigos e notícias do Strapi
│
├── lib/                    # ⚙️ Ferramentas e Configurações Gerais
│   ├── clients/            # Conectores HTTP para a FastAPI e para o Strapi
│   ├── constants.ts        # Coordenadas de Fortaleza e URLs padrão
│   └── utils/              # Pequenas funções utilitárias (ex: junção de classes CSS)
│
├── stores/                 # 💾 Estado Global da Aplicação (Zustand para login do usuário)
├── styles/                 # 🎨 Estilos Globais e Tokens de Cores (globals.css)
└── types/                  # 📐 Tipos do TypeScript (formatos dos planetas, artigos e respostas)
```

---

## Como Executar o Projeto Localmente

Siga este passo a passo simples. Você só precisa ter o **Node.js** instalado no seu computador.

### 1. Pré-requisito: Instalar o Node.js
Se ainda não tem, baixe a versão recomendada (LTS) no site oficial: [nodejs.org](https://nodejs.org/).

### 2. Acessar a pasta do Front-End
Abra o seu terminal (Prompt de Comando, PowerShell ou Terminal do VS Code) e navegue até a pasta do front-end:

```bash
cd frontend
```

### 3. Instalar as Dependências
Execute o comando abaixo para baixar as bibliotecas necessárias:

```bash
npm install
```
*O que ele faz? Lê o arquivo `package.json` e baixa ferramentas como React, Next.js e Tailwind para a pasta `node_modules`.*

### 4. Configurar as Variáveis de Ambiente
Crie um arquivo chamado `.env.local` na raiz da pasta `frontend/` (você pode duplicar o `.env.example` caso exista):

```env
# Endereço da API de Efemérides Astronômicas (FastAPI)
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000

# Endereço do Painel de Conteúdo (Strapi CMS)
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# Coordenadas Geográficas de Fortaleza (Ceará)
NEXT_PUBLIC_OBSERVATORIO_LAT=-3.7793
NEXT_PUBLIC_OBSERVATORIO_LON=-38.5661
```

### 5. Iniciar o Servidor de Desenvolvimento
Com tudo configurado, execute:

```bash
npm run dev
```

Pronto! O terminal mostrará:
```text
▲ Next.js 14.2.35
- Local: http://localhost:3000
```

Abra o seu navegador e acesse: **[http://localhost:3000](http://localhost:3000)**.

---

## Como Conectar ao Backend

O front-end conversa com **dois backends diferentes**, cada um especialista em uma área:

```text
                  ┌──────────────────────┐
                  │ Front-End (Next.js)  │
                  └──────────┬───────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
   FastAPI (Python) :8000         Strapi CMS (Node) :1337
   • Posição dos Planetas         • Notícias e Artigos
   • Fases da Lua                 • Textos de Pesquisa
   • Efemérides em Tempo Real     • Imagens da Galeria
```

### 1. Como Conectar com a FastAPI (Cálculos Astronômicos)
- **Arquivo de Configuração:** `src/lib/clients/fastapi-client.ts`
- **Serviço de Chamadas:** `src/features/sky-today/services/fastapiAstroService.ts`
- **O que acontece se a FastAPI estiver desligada?**  
  O sistema é resiliente! Se o backend em Python estiver desligado, o serviço captura o erro e ativa um **modo fallback** com dados astronômicos seguros. A página nunca quebra nem fica em branco.

### 2. Como Conectar com o Strapi (Artigos e Notícias)
- **Arquivo de Configuração:** `src/lib/clients/strapi-client.ts`
- **Serviço de Chamadas:** `src/features/content/services/strapiContentService.ts`
- **O que acontece se o Strapi estiver desligado?**  
  O front-end carrega instantaneamente um acervo editorial científico pré-configurado, garantindo que o visitante sempre tenha leituras disponíveis.

---

## Fluxo de Dados Explicado

Para entender como a mágica acontece na tela:

1. **A Tela Pede os Dados:** O componente `HeroStatusCockpit.tsx` chama o hook `useSkyToday()`.
2. **O TanStack Query Gerencia:** Ele verifica se já buscou esses dados nos últimos 5 minutos. Se sim, entrega do cache na hora.
3. **O Serviço Faz a Requisição:** Se for a primeira vez, `fastapiAstroService.getObservarHoje()` dispara um `GET` para `http://localhost:8000/observar-hoje`.
4. **O Backend Responde:** A FastAPI calcula e devolve um JSON com os planetas visíveis e a fase da Lua.
5. **A Interface Renderiza:** O React atualiza a tela instantaneamente, colorindo os badges e exibindo as orientações humanas.

---

## Como Criar uma Nova Página

Criar uma página no Next.js é tão simples quanto criar uma pasta com um arquivo `page.tsx`:

1. Para criar uma página `/sobre-o-telescopio`, crie a pasta:  
   `src/app/(public)/sobre-o-telescopio/`
2. Crie o arquivo `page.tsx` dentro dela:
   ```tsx
   import React from "react";

   export default function SobreTelescopioPage() {
     return (
       <div className="container mx-auto py-12 text-white">
         <h1 className="text-3xl font-bold">Nosso Telescópio Principal</h1>
         <p className="mt-4 text-space-text-muted">
           Detalhes sobre a ótica de 11 polegadas instalada em Fortaleza.
         </p>
       </div>
     );
   }
   ```
3. Acesse `http://localhost:3000/sobre-o-telescopio` no navegador!

---

## Como Criar um Novo Componente

1. Crie o arquivo em `src/components/ui/` ou `src/components/astronomy/`.
2. Exemplo de um botão de alerta:
   ```tsx
   import React from "react";

   interface AlertaProps {
     mensagem: string;
   }

   export function AlertaAstronomico({ mensagem }: AlertaProps) {
     return (
       <div className="rounded-xl border border-aurora-green/30 bg-aurora-green/10 p-4 text-aurora-green text-sm font-mono">
         <span>✨ {mensagem}</span>
       </div>
     );
   }
   ```

---

## Como Consumir uma Nova Rota da API

1. Adicione a chamada no serviço correspondente (ex: `src/features/sky-today/services/`):
   ```ts
   async getCometasVisiveis() {
     const { data } = await fastapiClient.get("/cometas");
     return data;
   }
   ```
2. Crie um Hook com TanStack Query:
   ```ts
   export function useCometas() {
     return useQuery({
       queryKey: ["cometas"],
       queryFn: () => fastapiAstroService.getCometasVisiveis(),
     });
   }
   ```
3. Use direto no seu componente React:
   ```tsx
   const { data: cometas, isLoading } = useCometas();
   ```

---

## Solução de Problemas Comuns (FAQ)

### 1. O projeto não inicia (`npm run dev` dá erro)
* Verifique se você está na pasta `frontend` e não na pasta raiz do projeto.
* Apague a pasta `node_modules` e o arquivo `.next`, depois execute `npm install` novamente.

### 2. Os planetas aparecem, mas dizem "Consultando..."
* O front-end tentou conectar com a FastAPI na porta 8000. Se ela não estiver rodando, em cerca de 2 segundos ele ativará os dados de fallback automaticamente.

### 3. Erro de CORS no console
* Isso ocorre se o backend não permitir conexões do `http://localhost:3000`. No seu arquivo da FastAPI (`main.py`), garanta que o middleware de CORS permita a origem do front-end.

### 4. Build de produção falhando (`npm run build`)
* O TypeScript é rigoroso: confira se não há imports de arquivos que foram apagados ou erros de tipagem apontados no terminal.

---

## Contribuindo com o Projeto

* **Mantenha a linguagem humana:** Evite adicionar jargões complicados para o usuário final.
* **Mobile First:** Ao criar um novo componente, teste primeiro em tela de smartphone (375px) antes de testar em monitor ultrawide.
* **Componentes pequenos:** Se um componente passar de 250 linhas, considere quebrar partes dele em subcomponentes menores.

---

## Licença

Este projeto é desenvolvido para fins educacionais, de pesquisa científica e extensão universitária sob licença aberta (MIT). Livre para estudo, expansão e uso acadêmico.
