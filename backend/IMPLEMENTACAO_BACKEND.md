# Implementação do backend — Observatório Otto de Alencar

**Data de corte:** 23/11/2026  
**Escopo:** CMS (Payload), API própria (FastAPI) e banco PostgreSQL. O frontend está em `frontend/` e consome estes dois serviços.

Este documento descreve o código presente no backend nesta data. Instruções de execução e publicação estão no [README da raiz](../README.md).

## Visão geral

| Serviço | Pasta | Tecnologia | Responsabilidade |
| --- | --- | --- | --- |
| CMS | `cms/` | Payload CMS 3 (app Next.js), Node 22 | Painel administrativo, usuários e perfis, conteúdo editorial, API REST/GraphQL |
| API própria | `api_python/` | Python 3.12, FastAPI, Skyfield | Cálculo astronômico e rotas protegidas por login do CMS |
| Banco | — | PostgreSQL 16 (Neon em produção) | `public`: dados do Payload; `observacoes`: reservado à FastAPI |
| Arquivos | — | Vercel Blob | Mídias enviadas no CMS |

Em produção os dois serviços são projetos Vercel separados (Root Directory `backend/cms` e `backend/api_python`). Em desenvolvimento, o Compose sobe o Postgres e a FastAPI, e o CMS roda com `npm run dev`.

## CMS (Payload)

### Coleções e globais

- **Users** — autenticação por e-mail e senha. Campo `perfil` (administrador, coordenador, editor, observacao), obrigatório e gravado no JWT (`saveToJWT`). Sem autocadastro: só administradores criam usuários; o primeiro usuário criado em `/admin` sempre vira administrador. Só administradores alteram o `perfil`.
- **Media** — `alt` (obrigatório), `legenda`, `credito` e o arquivo. Leitura pública.
- **Eventos** — `titulo`, `tipo` (observacao, oficina, palestra, visita), `inicio`, `fim` (não pode ser anterior ao início), `local`, `descricao`, `publicoAlvo`, `situacao` (agendado, realizado, cancelado), `linkInscricao` (opcional, só http/https), `fotos` (várias mídias) e `relato`. Rascunho/publicação.
- **Noticias** — `titulo`, `slug` (único, minúsculas e hífens), `resumo`, `categoria`, `autor`, `corpo`, `capa`, `dataPublicacao`, `projetoRelacionado`. Rascunho/publicação. Alimenta a página `/conteudo` do site.
- **Global Início** — `titulo`, `apresentacao` (texto rico), `destaques` (mídias). Rascunho/publicação.

### Permissões

Definidas em `cms/src/access/perfis.ts`:

- Leitura pública de Início, Eventos e Notícias devolve **só o publicado** (inclusive com `?draft=true`); administradores, coordenadores e editores veem também os rascunhos.
- Criar/editar/excluir conteúdo e mídias: administrador, coordenador e editor.
- Acesso ao painel `/admin`: administrador, coordenador e editor. O perfil `observacao` usa apenas a API.
- Usuários: administradores veem e editam todos; os demais, apenas o próprio cadastro.

### CORS

`ALLOWED_ORIGINS` (lista separada por vírgulas) define as origens do site que podem chamar o CMS pelo navegador. Vazia = nenhuma origem externa.

### Banco e migrações

- Adaptador `@payloadcms/db-postgres` com `DATABASE_URL`.
- `push` desligado: o esquema só muda por migrações (`npm run payload migrate:create`), versionadas em `cms/src/migrations/` e embutidas no bundle (`prodMigrations`).
- Script `ci` (`payload migrate && next build`) é o Build Command na Vercel.

### Mídia

`@payloadcms/storage-vercel-blob` com `BLOB_READ_WRITE_TOKEN` (store público). Sem o token, o plugin se desativa e os arquivos ficam em `cms/media/` (somente desenvolvimento). `alwaysInsertFields` mantém o esquema igual com ou sem o token.

## API própria (FastAPI)

### Endpoints

- **`GET /health`** — `{"status": "ok"}`.
- **`GET /observar-hoje[?data_hora=<ISO 8601>]`** — o que observar no céu de Fortaleza, calculado com Skyfield e `America/Fortaleza` (UTC-3, sem horário de verão). Regras implementadas em `astronomia.py`:
  - **RN001** — um planeta (Mercúrio, Vênus, Marte, Júpiter, Saturno) só é visível com altitude > 0° e Sol abaixo de -6°. De dia, nenhum planeta é listado e a resposta traz a MSG020 com a hora do pôr do Sol local. No crepúsculo (Sol entre 0° e -6°) a lista também fica vazia.
  - **RN002** — fase da Lua pelo ângulo de fase do Skyfield, em 8 faixas de 45° centradas (Nova, Crescente, Quarto crescente, Crescente gibosa, Cheia, Minguante gibosa, Quarto minguante, Minguante), com porcentagem iluminada e datas da próxima Lua cheia e da próxima Lua nova.
  - **RN003** — direção por azimute em 8 setores de 45° centrados. **RN004** — altura descrita em linguagem humana (< 15° perto do horizonte; 15–45° a meia altura; 45–75° alto no céu; > 75° quase acima da cabeça), mantendo altitude e azimute em graus.
  - **US034** — nascer e pôr do Sol e da Lua do dia em `HH:MM` (Fortaleza); se a Lua não nascer ou não se puser no dia, o campo traz o aviso em vez de ficar vazio.
  - **US035** — `data_hora` opcional, até 1 ano antes ou depois de hoje (fora disso, 422). A resposta traz `calculado_em` no fuso de Fortaleza.
  - Sem `data_hora`, a resposta vem com `Cache-Control: public, s-maxage=300`. Falha no cálculo → 503.
  - Mantém os campos auxiliares de dificuldade, equipamento sugerido e visibilidade a olho nu por planeta.
- **`POST /registros-observacao`** — exige login e perfil `observacao`, `coordenador` ou `administrador`. Hoje é só um esqueleto (devolve `usuario_id` e `perfil`).

### Autenticação

`auth.py` não valida JWT localmente: repassa o cabeçalho `Authorization` para `GET {CMS_URL}/api/users/me`. Se a resposta trouxer `user`, a requisição está autenticada e o perfil vem em `user.perfil`. Respostas: sem login → **401**; perfil não permitido → **403**; CMS inacessível ou com erro 5xx → **502**; `CMS_URL` ausente → **503**.

### Efemérides e Vercel

O arquivo `data/de421.bsp` (JPL/NASA, ~17 MB) é versionado e carregado por `skyfield.api.Loader` apontando para essa pasta, com `expire=False`: a função só lê arquivos e nunca baixa nem grava (na Vercel o sistema de arquivos da função não é gravável).

### Configuração

- CORS por `ALLOWED_ORIGINS` (lista separada por vírgulas; vazia = nenhuma origem).
- Variáveis: `CMS_URL`, `DATABASE_URL`, `ALLOWED_ORIGINS` (e `OBSERVATORIO_LAT`/`OBSERVATORIO_LON`, opcionais).
- `database.py` prepara a conexão SQLAlchemy (aceita URLs `postgres://` do Neon); ainda não é usado por nenhuma rota.
- Dependências: inclui `tzdata`, necessário para o fuso `America/Fortaleza` no runtime da Vercel.
- Testes (`pytest`) cobrem 401, 403, 200, 502, 503, CORS, as regras RN001–RN004, US034 e US035 (inclusive fases reais de 2026 conferidas com eclipses catalogados pela NASA) e a leitura das efemérides.

## PostgreSQL

Em desenvolvimento, o serviço `postgres` do Compose usa `postgres:16-alpine`, com banco, usuário e senha configuráveis por variáveis de ambiente e a porta publicada em `POSTGRES_PORT` (padrão 5432). O script `docker/postgres-init/01-schemas.sql` cria o schema `observacoes` na primeira criação do volume. Em produção, o banco é o Neon (plano Free), com os mesmos dois schemas.
