# Backend — Observatório Digital Otto de Alencar

O backend é composto pelo **CMS Payload** (`cms/`), pela **API FastAPI** (`api_python/`) e por um banco **PostgreSQL** (Neon em produção; contêiner Docker em desenvolvimento).

A documentação completa — arquitetura, como rodar, variáveis de ambiente, fluxo de migração e publicação na Vercel — está no [README da raiz](../README.md). Este arquivo resume só o que é específico do backend.

## Rodar localmente

```bash
cd backend
cp .env.example .env
docker compose up -d postgres                 # Postgres (porta POSTGRES_PORT, padrão 5432)

cd cms && cp .env.example .env && npm install
npm run payload migrate && npm run dev        # CMS em http://localhost:3000/admin

cd ../ && docker compose up -d --build api-python   # API em http://localhost:8000/docs
```

O CMS **não** roda no Docker: ele usa `npm run dev` e o Postgres do Compose.

## Endpoints da API FastAPI

- `GET /health`: verifica se a API está respondendo.
- `GET /observar-hoje[?data_hora=<ISO 8601>]`: o que observar no céu de Fortaleza (fuso `America/Fortaleza`, UTC-3). Lê as efemérides de `api_python/data/de421.bsp` (sem rede e sem gravar em disco).
  - **Planetas (RN001):** só aparecem se estiverem a mais de 0° do horizonte **e** com o Sol abaixo de -6°. De dia a lista vem vazia e `mensagem` traz "Ainda é dia em Fortaleza. Os planetas começam a aparecer depois do pôr do Sol, às HH:MM.". Cada planeta traz `direcao_cardeal` (RN003: Norte, Nordeste, Leste…), `altura` (RN004: "perto do horizonte", "a meia altura", "alto no céu", "quase acima da cabeça") e também `altitude_graus` e `azimute_graus`.
  - **Lua (RN002):** `lua.fase_nome` (Nova, Crescente, Quarto crescente, Crescente gibosa, Cheia, Minguante gibosa, Quarto minguante, Minguante), `iluminacao_percentual`, `proxima_lua_cheia` e `proxima_lua_nova`. `fase_lua_nome` e `fase_lua_graus` continuam no topo da resposta.
  - **Sol e Lua do dia (US034):** `sol` e `lua` trazem `nascer` e `por` em `HH:MM` no fuso de Fortaleza; quando a Lua não nasce ou não se põe no dia, o campo traz o aviso ("A Lua não nasce neste dia.") e `nascer_iso`/`por_iso` ficam `null`.
  - **Data e hora (US035):** `data_hora` opcional (ISO 8601; sem fuso = horário de Fortaleza; use `%2B` no lugar de `+` na URL). Aceita até 1 ano antes ou depois de hoje; fora disso responde **422**. A resposta informa o momento calculado em `calculado_em`.
  - **Cache:** sem `data_hora`, a resposta leva `Cache-Control: public, s-maxage=300` (poupa a cota gratuita da Vercel).
  - Se o cálculo falhar (ex.: efemérides ausentes), responde **503**.
- `POST /registros-observacao`: rota protegida. Exige `Authorization` válido no CMS e perfil `observacao`, `coordenador` ou `administrador` (sem login → 401; outro perfil → 403). A gravação do registro ainda não está implementada.

O conteúdo editorial (início, eventos, notícias) **não** passa pela FastAPI: o site lê direto do CMS em `/api/<coleção>` e `/api/globals/<global>`.

## Testes

```bash
cd backend/api_python
pip install -r requirements-dev.txt
pytest          # 401, 403, 200, 502, 503 e CORS (o CMS é simulado; nenhum teste usa rede)
```

## Encerrar e persistência

```bash
docker compose down        # para os contêineres e mantém os dados
docker compose down -v     # também apaga o volume do Postgres
```

## Estrutura

```text
backend/
├── cms/                 # Payload CMS (coleções, globais, acessos, migrações)
├── api_python/          # FastAPI (main, router, auth, astronomia, data/de421.bsp, tests/)
├── docker/postgres-init/# cria o schema "observacoes"
└── docker-compose.yml
```
