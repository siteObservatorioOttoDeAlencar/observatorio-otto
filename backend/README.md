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
- `GET /observar-hoje`: planetas visíveis, direção cardeal, dificuldade, fase atual da Lua (nome e ângulo) e resumo das condições de observação para a localização configurada. Lê as efemérides de `api_python/data/de421.bsp` (sem rede). Se houver falha no cálculo, responde em modo degradado (`"status": "degraded"`).
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
