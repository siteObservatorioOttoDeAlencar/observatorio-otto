# Backend — Observatório Digital Otto de Alencar

Setup local do backend: Strapi (CMS) + API própria (FastAPI) + Postgres, orquestrados via Docker Compose.

## Pré-requisitos

- Docker e Docker Compose instalados
- Git

## Passo a passo — primeira vez

1. **Copie o arquivo de variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` e troque os segredos (`STRAPI_JWT_SECRET`, senhas, etc.) por valores gerados de verdade:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   Gere um valor diferente para cada segredo do `.env`.

2. **Suba os containers:**
   ```bash
   docker compose up --build
   ```
   Na primeira execução, o Strapi vai se instalar sozinho dentro do container (demora alguns minutos). Acompanhe o log até aparecer que o servidor subiu.

3. **Acesse o painel admin do Strapi:**
   - http://localhost:1337/admin
   - Crie o primeiro usuário administrador (isso só acontece uma vez)

4. **Acesse a documentação interativa da API própria:**
   - http://localhost:8000/docs
   - O FastAPI gera essa tela automaticamente — dá pra testar os endpoints direto por ali

## Primeiros passos técnicos depois do setup

1. No painel do Strapi, criar os primeiros *content-types*:
   - `Noticia` (título, texto, imagem de capa, data)
   - `Evento` (título, descrição, data, local, imagem)
   - `Material Educativo` (título, arquivo, descrição)
   - `Item de Galeria` (imagem, legenda, data)

2. Em `Settings → Roles` no Strapi, configurar as permissões (quem publica, quem edita).

3. Testar o endpoint `/observar-hoje` da API própria — na primeira chamada ele baixa o arquivo de efemérides (`de421.bsp`, ~17MB), pode demorar um pouco. Nas chamadas seguintes já fica em cache.

4. Validar a integração de autenticação: gerar um JWT fazendo login no Strapi, e usar esse token para chamar um endpoint protegido da API própria (`/registros-observacao`) — confirma que os dois serviços compartilham o mesmo segredo corretamente.

## Estrutura do projeto

```
observatorio-otto/
├── docker-compose.yml
├── .env.example
├── strapi/              → CMS (instalado automaticamente no primeiro build)
│   └── Dockerfile
└── api-propria/         → API própria em FastAPI
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py           → rotas
    ├── auth.py           → validação do JWT do Strapi
    └── astronomia.py     → lógica do recurso "O que observar no céu?"
```

## Próximos passos (fora do escopo deste starter)

- Configurar deploy: Strapi → Render, API própria → Fly.io, banco → Supabase (ver `ARCHITECTURE.md` e o PRD do projeto)
- Configurar o cron job de ping para mitigar o "sleep" do free tier
- Definir a estrutura de dados real de Registros de Observações Astronômicas junto com os coordenadores
