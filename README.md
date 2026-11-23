# Observatório Digital Otto de Alencar 🔭✨

> Uma plataforma web moderna, aberta e acessível que responde em menos de 5 segundos se vale a pena olhar para o céu de Fortaleza hoje à noite, para onde olhar e o que você consegue ver com o que tem à mão.

## O Que É Este Projeto?

O **Observatório Digital Otto de Alencar** é um projeto de extensão universitária (UECE) e de divulgação científica sediado em Fortaleza, Ceará, que **aproxima a astronomia do público em geral**: curiosos e famílias, estudantes e professores, e astrônomos amadores. Ele traduz cálculos matemáticos e dados da NASA em linguagem humana, orientações práticas e recursos visuais intuitivos.

Ao entrar no site, qualquer pessoa consegue saber se o céu está bom hoje, ver os planetas e a Lua com orientações em **Modo Simples** ou **Modo Técnico**, filtrar o que dá para ver a olho nu, de binóculo ou de telescópio, acompanhar a **agenda de eventos** do observatório e ler artigos de divulgação científica.

---

## Arquitetura

Tudo roda em planos **gratuitos** (Vercel Hobby, Neon Free, Vercel Blob). São **três projetos Vercel** a partir deste repositório:

```text
                 ┌───────────────────────────────┐
                 │  Site — Next.js (frontend/)   │
                 └───────┬───────────────┬───────┘
                         │ conteúdo,     │ cálculos e
                         │ login         │ registros
                         ▼               ▼
        ┌────────────────────────┐   ┌──────────────────────────┐
        │ CMS — Payload 3        │◄──│ API — FastAPI (Python)   │
        │ backend/cms            │   │ backend/api_python       │
        └──┬──────────────────┬──┘   └───────────┬──────────────┘
           │                  │  valida login    │
           │                  │  (GET /api/users/me)
           ▼                  ▼                  ▼
   ┌─────────────┐   ┌──────────────────────────────────────┐
   │ Vercel Blob │   │ Neon Postgres (plano Free)           │
   │ imagens     │   │  schema "public"      → Payload      │
   └─────────────┘   │  schema "observacoes" → FastAPI      │
                     └──────────────────────────────────────┘
```

| Peça | Pasta | Tecnologia | Função |
| --- | --- | --- | --- |
| Site | `frontend/` | Next.js 15, React 19, Tailwind, TanStack Query | Páginas públicas, login, registro de observações |
| CMS | `backend/cms` | Payload CMS 3 (app Next.js) | Painel `/admin`, usuários e perfis, conteúdo, API REST/GraphQL |
| API | `backend/api_python` | FastAPI + Skyfield | `GET /observar-hoje`, `POST /registros-observacao` (protegida) |
| Banco | — | Neon Postgres | Um banco, dois schemas |
| Arquivos | — | Vercel Blob (`@payloadcms/storage-vercel-blob`) | Fotos e mídias enviadas no CMS |

**Login único:** quem faz login é o Payload (e-mail e senha). A FastAPI não tem senha nem segredo de JWT: ela repassa o cabeçalho `Authorization` recebido para `GET {CMS_URL}/api/users/me` e usa o `user.perfil` da resposta. O site envia `Authorization: JWT <token>` nos dois backends.

### Conteúdo do CMS

| Tipo | Slug da API | Campos principais | Leitura pública |
| --- | --- | --- | --- |
| Global **Início** | `/api/globals/inicio` | `titulo`, `apresentacao` (texto rico), `destaques` (mídias) | só o publicado |
| **Eventos** | `/api/eventos` | `titulo`, `tipo` (observação, oficina, palestra, visita), `inicio`, `fim`, `local`, `descricao`, `publicoAlvo`, `situacao` (agendado, realizado, cancelado), `linkInscricao`, `fotos`, `relato` | só o publicado |
| **Notícias** | `/api/noticias` | `titulo`, `slug`, `resumo`, `categoria`, `autor`, `corpo`, `capa`, `dataPublicacao`, `projetoRelacionado` | só o publicado |
| **Mídias** | `/api/media` | `alt` (obrigatório), `legenda`, `credito` + arquivo | sim |
| **Usuários** | `/api/users` | `email`, `perfil` | não |

Início, Eventos e Notícias têm **rascunho/publicação**: visitantes só enxergam o publicado (inclusive com `?draft=true`); quem edita vê os rascunhos.

### Perfis de usuário

O campo `perfil` (obrigatório, vai dentro do JWT) define o que cada usuário pode fazer. **Não existe autocadastro**: só administradores criam usuários, e o site não tem página de cadastro ("Para ter acesso, solicite a um administrador").

| Perfil | Painel `/admin` | Editar conteúdo e mídias | Gerenciar usuários | `POST /registros-observacao` |
| --- | :---: | :---: | :---: | :---: |
| `administrador` | ✅ | ✅ | ✅ | ✅ |
| `coordenador` | ✅ | ✅ | — | ✅ |
| `editor` | ✅ | ✅ | — | ❌ (403) |
| `observacao` | — | — | — | ✅ |

O **primeiro usuário** criado em `/admin` sempre vira `administrador`.

### Estrutura do repositório

```text
.
├── frontend/                 # Site Next.js — projeto Vercel nº 3
├── backend/
│   ├── cms/                  # Payload CMS — projeto Vercel nº 1
│   │   └── src/{collections,globals,access,migrations}
│   ├── api_python/           # FastAPI — projeto Vercel nº 2 (data/de421.bsp versionado)
│   ├── docker/postgres-init/ # cria o schema "observacoes" no Postgres local
│   └── docker-compose.yml    # Postgres + FastAPI para desenvolvimento
└── README.md
```

---

## Como rodar localmente

**Pré-requisitos:** Node.js 22 (o Payload 3.94 exige `^22.23.5` ou `^24.22.3`), Python 3.12 e Docker.

### 1. Banco de dados (Postgres)

```bash
cd backend
cp .env.example .env          # opcional: todos os valores têm padrão
docker compose up -d postgres
```

> Se já existe um Postgres instalado no seu computador usando a porta 5432, defina `POSTGRES_PORT=5433` no `backend/.env` e use `...@127.0.0.1:5433/...` na `DATABASE_URL` do CMS.

### 2. CMS (Payload) — http://localhost:3000

```bash
cd backend/cms
cp .env.example .env          # preencha PAYLOAD_SECRET (openssl rand -hex 32)
npm install
npm run payload migrate       # cria as tabelas (o esquema é controlado por migrações)
npm run dev
```

1. Abra <http://localhost:3000/admin> e crie o primeiro usuário (vira `administrador`).
2. Em **Globals → Início**, preencha o título e publique; crie Eventos e Notícias e publique.
3. Leia pela API: `curl http://localhost:3000/api/globals/inicio`

Sem `BLOB_READ_WRITE_TOKEN`, o plugin do Vercel Blob fica desativado e os uploads vão para `backend/cms/media/` (ignorado pelo Git).

### 3. API (FastAPI) — http://localhost:8000

Com Docker (o contêiner alcança o CMS do seu computador em `host.docker.internal:3000`):

```bash
cd backend
docker compose up -d --build api-python     # documentação em http://localhost:8000/docs
```

Ou direto no Python:

```bash
cd backend/api_python
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
pytest                                               # testes de 401/403/200/502/503 e CORS
```

Teste rápido com login:

```bash
curl -X POST http://localhost:8000/registros-observacao          # 401 (sem login)
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"voce@exemplo.com","password":"sua-senha"}' | jq -r .token)
curl -X POST http://localhost:8000/registros-observacao -H "Authorization: JWT $TOKEN"
```

Perfil `editor` recebe **403**; `observacao`, `coordenador` e `administrador` recebem 200.

### 4. Site (Next.js) — http://localhost:3001

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # porta 3001, para não colidir com o CMS na 3000
npm test             # testes unitários (Vitest)
npm run build
```

Se o CMS ou a API estiverem fora do ar, o site **não quebra**: usa conteúdo de reserva (texto de apresentação, acervo de artigos, aviso de agenda indisponível e dados astronômicos padrão).

---

## Variáveis de ambiente

Nunca coloque valores reais no repositório: cada projeto tem um `.env.example` com os nomes. Os arquivos `.env` estão no `.gitignore`.

### `backend/cms` (projeto Vercel do CMS)

| Variável | Descrição | Origem na Vercel |
| --- | --- | --- |
| `DATABASE_URL` | Conexão Postgres | Injetada pela integração Neon (URL *pooled*) |
| `PAYLOAD_SECRET` | Segredo de JWT/cookies do Payload | Manual: `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob | Injetada ao conectar o Blob store |
| `ALLOWED_ORIGINS` | URL(s) do site autorizadas a chamar o CMS pelo navegador (CORS), separadas por vírgula, sem barra final | Manual |

### `backend/api_python` (projeto Vercel da API)

| Variável | Descrição |
| --- | --- |
| `CMS_URL` | URL pública do CMS, sem barra final |
| `DATABASE_URL` | Mesmo banco Neon do CMS (a API usa o schema `observacoes`) |
| `ALLOWED_ORIGINS` | Origens do site liberadas no CORS, separadas por vírgula. Vazia = nenhuma |
| `OBSERVATORIO_LAT` / `OBSERVATORIO_LON` | Opcionais; padrão: Fortaleza |

### `frontend` (projeto Vercel do site)

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_CMS_URL` | URL do CMS (conteúdo e login) |
| `NEXT_PUBLIC_API_URL` | URL da FastAPI |
| `NEXT_PUBLIC_OBSERVATORIO_LAT` / `_LON` | Opcionais; padrão: Fortaleza |

### `backend/docker-compose.yml`

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, `CMS_URL`, `ALLOWED_ORIGINS` — todas com padrão; veja `backend/.env.example`.

---

## Fluxo de mudança de conteúdo (modelo de dados)

O banco do Payload é controlado por **migrações** (`push` desligado, inclusive no desenvolvimento), então o que você testa local é exatamente o que roda em produção.

```text
alterar coleção/global → gerar migração → testar local → Pull Request → merge → deploy automático
```

1. **Altere** a coleção/global em `backend/cms/src/collections` ou `src/globals`.
2. **Gere tipos e migração** (com o Postgres local no ar):
   ```bash
   cd backend/cms
   npm run generate:types
   npm run payload migrate:create -- descricao_curta
   ```
   Revise o arquivo novo em `src/migrations/` (ele também é registrado em `index.ts`).
3. **Aplique e teste** localmente: `npm run payload migrate` e `npm run dev`.
4. **Abra um Pull Request** incluindo a migração. Nunca edite uma migração que já foi para produção: crie outra.
5. **Merge** → a Vercel faz o deploy. O *Build Command* `npm run ci` executa `payload migrate && next build`: as migrações pendentes rodam no Neon antes do build.

> ⚠️ O projeto do CMS **não gera Preview Deployments**: o *Ignored Build Step* (`[ "$VERCEL_ENV" != "production" ]`) cancela builds que não sejam de produção, e Neon e Blob estão conectados só ao ambiente Production. Motivo: um Preview rodaria `payload migrate` no mesmo banco da produção, aplicando a migração de um PR **antes** do merge. Valide migrações localmente (passo 3).

Edições de **conteúdo** (textos, imagens, publicação) são feitas no `/admin` e não passam por PR.

---

## Publicação na Vercel

Três projetos no plano Hobby, todos ligados a este repositório:

| Projeto | Root Directory | Framework | Build Command |
| --- | --- | --- | --- |
| `observatorio-otto-cms` | `backend/cms` | Next.js (Node 22) | `npm run ci` |
| `observatorio-otto-api` | `backend/api_python` | FastAPI (detectado por `main.py` com `app`) | — |
| `observatorio-otto-site` | `frontend` | Next.js | padrão |

1. **Neon (Marketplace):** plano **Free**, região `iad1`, conectado ao Production do CMS (injeta `DATABASE_URL`).
2. **Blob:** store **público** (o plugin do Payload só suporta acesso público) conectado ao Production do CMS.
3. **Variáveis:** conforme as tabelas acima. `ALLOWED_ORIGINS` do CMS e da API recebem a URL do site.
4. **Logo após o primeiro deploy do CMS, abra `/admin` e crie o primeiro usuário** — enquanto não existir nenhum, qualquer pessoa que acessar a tela vira administradora.

A função da API **não pode baixar nem gravar arquivos**: por isso `backend/api_python/data/de421.bsp` é versionado (~17 MB) e o Skyfield só o lê. Para regenerar (raro): baixe `https://ssd.jpl.nasa.gov/ftp/eph/planets/bsp/de421.bsp` para essa pasta.

---

## Pendências

- [ ] **Voltar a Production Branch para `main`.** Nos **três** projetos da Vercel (`observatorio-otto-cms`, `-api` e `-site`) a *Production Branch* está temporariamente em **`melquidev-vercel`**. Depois de validar, faça o merge de `melquidev-vercel` na `main` e volte a Production Branch para `main` (*Settings → Environments → Production → Branch Tracking*, ou *Settings → Git → Production Branch*); confira que o deploy seguinte, a partir da `main`, passa.
- [ ] Definir `ALLOWED_ORIGINS` (CMS e API) com a URL real do site e confirmar `CMS_URL` / `NEXT_PUBLIC_CMS_URL` com o domínio final do CMS.
- [ ] As migrações do CMS são duas (`inicial` e `eventos_noticias`); podem ser unificadas numa só antes do primeiro deploy real, enquanto o banco do Neon ainda está vazio.
- [ ] `npm audit` do frontend ainda aponta o `postcss` embutido no Next 15 (afeta só o build; a correção exige Next 16).

---

## Solução de problemas

- **`autenticação do tipo senha falhou` ao migrar/rodar o CMS:** provavelmente há outro Postgres na porta 5432 do seu computador. Use `POSTGRES_PORT=5433` (veja acima).
- **`401` na FastAPI com token válido:** confira `CMS_URL` e se o cabeçalho é `Authorization: JWT <token>` (`Bearer <token>` também funciona).
- **Erro de CORS no navegador:** inclua a origem exata do site (com `https://`, sem barra final) em `ALLOWED_ORIGINS` do CMS e da API.
- **Site mostra "agenda indisponível" ou texto de reserva:** o CMS não respondeu; confira `NEXT_PUBLIC_CMS_URL` e se o CMS está no ar. A página se atualiza sozinha a cada 60 s.

---

## Licença

Este projeto é desenvolvido para fins educacionais, de pesquisa científica e extensão universitária sob licença aberta (MIT). Livre para estudo, expansão e uso acadêmico.
