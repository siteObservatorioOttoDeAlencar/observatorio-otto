# Observatório Digital Otto de Alencar — Backend 🔭✨

> Uma plataforma web moderna, aberta e acessível que responde em menos de 5 segundos se vale a pena olhar para o céu de Fortaleza hoje à noite, para onde olhar e o que você consegue ver com o que tem à mão.

Este repositório é o **backend** do projeto: o CMS (conteúdo editorial) e a API de cálculos astronômicos. O frontend (Next.js) fica em **outro repositório**.

## O Que É Este Projeto?

O **Observatório Digital Otto de Alencar** é um projeto de extensão universitária (UECE) e de divulgação científica sediado em Fortaleza, Ceará, que **aproxima a astronomia do público em geral**: curiosos e famílias, estudantes e professores, e astrônomos amadores. Ele traduz cálculos matemáticos e dados da NASA em linguagem humana, orientações práticas e recursos visuais intuitivos.

---

## Arquitetura

Tudo roda em planos **gratuitos** (Vercel Hobby, Neon Free, Vercel Blob).

```text
                 ┌─────────────────────────────┐
                 │  Frontend (Next.js)         │   outro repositório
                 └───────┬─────────────┬───────┘
                         │ conteúdo    │ cálculos + registros
                         ▼             ▼
        ┌────────────────────┐   ┌─────────────────────────┐
        │ CMS — Payload 3    │◄──│ API — FastAPI (Python)  │
        │ projeto Vercel     │   │ projeto Vercel          │
        │ pasta cms/         │   │ pasta api_python/       │
        └──┬──────────────┬──┘   └───────────┬─────────────┘
           │              │   valida login   │
           │              │   (GET /api/users/me)
           ▼              ▼                  ▼
   ┌─────────────┐  ┌─────────────────────────────────────┐
   │ Vercel Blob │  │ Neon Postgres (plano Free)          │
   │ imagens e   │  │  schema "public"      → Payload     │
   │ arquivos    │  │  schema "observacoes" → FastAPI     │
   └─────────────┘  └─────────────────────────────────────┘
```

| Peça | Tecnologia | Função |
| --- | --- | --- |
| `cms/` | Payload CMS 3 (app Next.js) | Painel `/admin`, usuários e perfis, página inicial, mídias, API REST/GraphQL de conteúdo |
| `api_python/` | FastAPI + Skyfield | `GET /observar-hoje` (planetas e Lua), `POST /registros-observacao` (rota protegida) |
| Banco | Neon Postgres | Um banco, dois schemas: `public` (Payload) e `observacoes` (FastAPI) |
| Arquivos | Vercel Blob | Imagens enviadas no CMS (`@payloadcms/storage-vercel-blob`) |

**Login único:** quem faz login é o Payload. A FastAPI não tem senha nem segredo de JWT: ela repassa o cabeçalho `Authorization` recebido para `GET {CMS_URL}/api/users/me` e usa o `user.perfil` da resposta.

### Perfis de usuário

O campo `perfil` (obrigatório, vai dentro do JWT) define o que cada usuário pode fazer. **Não existe autocadastro**: só administradores criam usuários.

| Perfil | Painel `/admin` | Editar Início e Mídias | Gerenciar usuários | `POST /registros-observacao` |
| --- | :---: | :---: | :---: | :---: |
| `administrador` | ✅ | ✅ | ✅ | ✅ |
| `coordenador` | ✅ | ✅ | — | ✅ |
| `editor` | ✅ | ✅ | — | ❌ (403) |
| `observacao` | — | — | — | ✅ |

O **primeiro usuário** criado em `/admin` sempre vira `administrador`. Leitura de `GET /api/globals/inicio` e de mídias é pública; visitantes só enxergam a versão **publicada** da página Início (rascunhos só aparecem para quem pode editar).

### Estrutura do repositório

```text
.
├── cms/                  # Payload CMS (Next.js) — projeto Vercel nº 1
│   └── src/
│       ├── collections/  # Users (com "perfil") e Media
│       ├── globals/      # Inicio (substitui o single type "Início")
│       ├── access/       # regras de permissão por perfil
│       ├── migrations/   # migrações do banco (versionadas)
│       └── payload.config.ts
├── api_python/           # FastAPI — projeto Vercel nº 2
│   ├── main.py           # instância `app` (entrypoint da Vercel) + CORS
│   ├── router.py         # rotas
│   ├── auth.py           # valida login chamando o CMS
│   ├── astronomia.py     # cálculos (Skyfield)
│   └── data/de421.bsp    # efemérides NASA/JPL, versionadas (~17 MB)
├── docker/postgres-init/ # cria o schema "observacoes" no Postgres local
└── docker-compose.yml    # Postgres + FastAPI para desenvolvimento
```

---

## Como rodar localmente

**Pré-requisitos:** Node.js 22 (o Payload 3.94 exige `^22.23.5` ou `^24.22.3`), Python 3.12 e Docker.

### 1. Banco de dados (Postgres)

```bash
cp .env.example .env          # opcional: todos os valores têm padrão
docker compose up -d postgres
```

> Se já existe um Postgres instalado no seu computador usando a porta 5432, defina `POSTGRES_PORT=5433` no `.env` da raiz e use `...@127.0.0.1:5433/...` na `DATABASE_URL` do CMS.

### 2. CMS (Payload)

```bash
cd cms
cp .env.example .env          # preencha PAYLOAD_SECRET (openssl rand -hex 32)
npm install
npm run payload migrate       # cria as tabelas (o esquema é controlado por migrações)
npm run dev                   # http://localhost:3000/admin
```

1. Abra <http://localhost:3000/admin> e crie o primeiro usuário (vira `administrador`).
2. Em **Globals → Início**, preencha o título e publique.
3. Leia pela API: `curl http://localhost:3000/api/globals/inicio`

Sem `BLOB_READ_WRITE_TOKEN`, o plugin do Vercel Blob fica desativado e os uploads vão para `cms/media/` (ignorado pelo Git).

### 3. API (FastAPI)

Com Docker (o contêiner alcança o CMS do seu computador em `host.docker.internal:3000`):

```bash
docker compose up -d --build api-python     # http://localhost:8000/docs
```

Ou direto no Python:

```bash
cd api_python
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000
```

Testes rápidos:

```bash
curl http://localhost:8000/observar-hoje                       # público
curl -X POST http://localhost:8000/registros-observacao        # 401 (sem login)

# Com login: pegue o token no CMS e envie o mesmo cabeçalho que o Payload aceita
TOKEN=$(curl -s -X POST http://localhost:3000/api/users/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"voce@exemplo.com","password":"sua-senha"}' | jq -r .token)
curl -X POST http://localhost:8000/registros-observacao -H "Authorization: JWT $TOKEN"
```

Perfil `editor` recebe **403**; `observacao`, `coordenador` e `administrador` recebem 200.

> Se o frontend também usa a porta 3000, rode um dos dois em outra porta (ex.: `npm run dev -- -p 3001` no `cms/`) e ajuste `CMS_URL`.

---

## Variáveis de ambiente

Nunca coloque valores reais no repositório: cada projeto tem um `.env.example` com os nomes. O `.env` está no `.gitignore`.

### `cms/` (projeto Vercel do CMS)

| Variável | Descrição | Origem na Vercel |
| --- | --- | --- |
| `DATABASE_URL` | Conexão Postgres | Injetada pela integração Neon (use a URL *pooled*) |
| `PAYLOAD_SECRET` | Segredo de JWT/cookies do Payload | Manual: `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Token do Vercel Blob | Injetada ao conectar o Blob store ao projeto |

### `api_python/` (projeto Vercel da API)

| Variável | Descrição |
| --- | --- |
| `CMS_URL` | URL pública do CMS, sem barra final (ex.: `https://meu-cms.vercel.app`) |
| `DATABASE_URL` | Mesmo banco Neon do CMS (a API usa o schema `observacoes`) |
| `ALLOWED_ORIGINS` | Origens do frontend liberadas no CORS, separadas por vírgula. Vazia = nenhuma |
| `OBSERVATORIO_LAT` / `OBSERVATORIO_LON` | Opcionais; padrão: Fortaleza (-3.7793, -38.5661) |

### Raiz (`docker-compose.yml`)

`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, `CMS_URL`, `ALLOWED_ORIGINS` — todas com padrão; veja `.env.example`.

---

## Fluxo de mudança de conteúdo (modelo de dados)

O banco do Payload é controlado por **migrações** (`push` desligado, inclusive no desenvolvimento), então o que você testa local é exatamente o que roda em produção.

```text
alterar coleção/global → gerar migração → testar local → Pull Request → merge → deploy automático
```

1. **Altere** a coleção/global em `cms/src/collections` ou `cms/src/globals`.
2. **Gere tipos e migração** (com o Postgres local no ar):
   ```bash
   cd cms
   npm run generate:types
   npm run payload migrate:create -- descricao_curta
   ```
   Revise o arquivo novo em `cms/src/migrations/` (ele também é registrado em `index.ts`).
3. **Aplique e teste** localmente: `npm run payload migrate` e `npm run dev`.
4. **Abra um Pull Request** incluindo a migração. Nunca edite uma migração que já foi para a `main`: crie outra.
5. **Merge na `main`** → a Vercel faz o deploy. O *Build Command* `npm run ci` executa `payload migrate && next build`: as migrações pendentes rodam no Neon antes do build.

> ⚠️ O projeto do CMS na Vercel **não gera Preview Deployments**: o *Ignored Build Step* (`[ "$VERCEL_ENV" != "production" ]`) cancela qualquer build que não seja de produção, e o Neon e o Blob estão conectados só ao ambiente Production. Motivo: um Preview rodaria `payload migrate` no mesmo banco da produção, aplicando a migração de um PR **antes** do merge. Valide migrações localmente (passo 3) antes de abrir o PR.

Edições de **conteúdo** (textos, imagens, publicação) são feitas no `/admin` e não passam por PR.

---

## Publicação na Vercel

São **dois projetos** Vercel a partir deste mesmo repositório (plano Hobby):

| | CMS | API |
| --- | --- | --- |
| Root Directory | `cms` | `api_python` |
| Framework | Next.js | FastAPI (detectado por `main.py` com `app`) |
| Build Command | `npm run ci` | — |
| Node / Python | Node 22 (`engines` no `package.json`) | Python 3.12 |

Passos no painel/CLI da Vercel:

1. **CMS:** importe o repositório com Root Directory `cms`; em *Build & Development Settings* defina o Build Command `npm run ci`.
2. **Neon:** em *Storage* → *Marketplace* → Neon, plano **Free**, região `us-east`, conectado ao projeto do CMS (injeta `DATABASE_URL`).
3. **Blob:** em *Storage* → *Blob* → crie um store e conecte ao projeto do CMS (injeta `BLOB_READ_WRITE_TOKEN`).
4. **`PAYLOAD_SECRET`:** adicione em *Settings → Environment Variables*.
5. **API:** crie outro projeto com Root Directory `api_python` e defina `CMS_URL`, `DATABASE_URL` (a mesma do Neon) e `ALLOWED_ORIGINS`.
6. **Logo após o primeiro deploy do CMS, abra `/admin` e crie o primeiro usuário** — enquanto não existir nenhum, qualquer pessoa que acessar a tela vira administradora.

### Observações da API na Vercel

- A função **não pode baixar nem gravar arquivos**: por isso `data/de421.bsp` é versionado e o Skyfield só o lê.
- Para regenerar o arquivo (raro): baixe `https://ssd.jpl.nasa.gov/ftp/eph/planets/bsp/de421.bsp` para `api_python/data/`.

---

## Pendências

- [ ] **Voltar a Production Branch para `main`.** Nos **dois** projetos da Vercel (`observatorio-otto-cms` e `observatorio-otto-api`) a *Production Branch* está temporariamente em **`payload-cms`**, para que o primeiro deploy use as variáveis e o banco de produção antes do merge. Depois do merge do PR: *Settings → Environments → Production → Branch Tracking* (ou *Settings → Git → Production Branch*) → `main`, e confira que o deploy seguinte, a partir da `main`, passa.
- [ ] Definir `ALLOWED_ORIGINS` da API com a URL real do frontend (hoje é provisório) e confirmar `CMS_URL` com o domínio final do CMS.

---

## Solução de problemas

- **`autenticação do tipo senha falhou` ao migrar/rodar o CMS:** provavelmente há outro Postgres na porta 5432 do seu computador. Use `POSTGRES_PORT=5433` (veja acima).
- **`payload migrate` reclama de "dev mode"/schema existente:** o banco local foi criado de outra forma. Recrie-o: `docker compose down -v && docker compose up -d postgres` e rode `npm run payload migrate`.
- **`401` na FastAPI com token válido:** confira `CMS_URL` e se o cabeçalho é `Authorization: JWT <token>` (`Bearer <token>` também funciona).
- **Erro de CORS no navegador:** inclua a origem exata do frontend (com `https://`, sem barra final) em `ALLOWED_ORIGINS`.

---

## Licença

Este projeto é desenvolvido para fins educacionais, de pesquisa científica e extensão universitária sob licença aberta (MIT). Livre para estudo, expansão e uso acadêmico.
