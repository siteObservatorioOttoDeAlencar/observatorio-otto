# Backend — Observatório Digital Otto de Alencar

Backend do projeto, composto pelo CMS Strapi, uma API em FastAPI e um banco PostgreSQL. Os três serviços são executados localmente com Docker Compose.

## Pré-requisitos

- Git
- Docker Desktop (incluindo Docker Compose)
- Node.js 20 ou compatível com a versão definida em `strapi/app/package.json` (necessário apenas para gerar segredos)

## Configuração inicial

1. Clone o repositório e entre na pasta do projeto.

2. Crie um arquivo `.env` na raiz do projeto com estas variáveis:

   ```dotenv
   POSTGRES_USER=observatorio
   POSTGRES_PASSWORD=defina_uma_senha
   POSTGRES_DB=observatorio

   STRAPI_JWT_SECRET=gere_um_segredo
   STRAPI_ADMIN_JWT_SECRET=gere_outro_segredo
   STRAPI_APP_KEYS=chave1,chave2,chave3,chave4
   STRAPI_API_TOKEN_SALT=gere_uma_salt

   CLOUDINARY_NAME=
   CLOUDINARY_KEY=
   CLOUDINARY_SECRET=
   ```

   Substitua os valores de exemplo por valores próprios. Gere segredos fortes e diferentes para cada variável de segredo; `STRAPI_APP_KEYS` deve conter quatro valores separados por vírgulas. Por exemplo, este comando gera um valor aleatório:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

   Os dados do Cloudinary são usados pelo Strapi para upload de mídia. Preencha-os com as credenciais da sua conta para usar esse recurso. O `.env` é ignorado pelo Git; não o versione nem compartilhe seus segredos.

3. Construa a imagem do Strapi e instale as dependências Node dentro do container:

   ```bash
   docker compose --env-file .env -f backend/docker-compose.yml build
   docker compose --env-file .env -f backend/docker-compose.yml run --rm --no-deps strapi npm ci
   ```

   Execute novamente `npm ci` quando as dependências em `backend/strapi/app/package.json` ou `backend/strapi/app/package-lock.json` forem alteradas.

## Executar o projeto

Na raiz do repositório, inicie os serviços:

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
- `GET /observar-hoje`: calcula planetas visíveis e condições de observação para a localização configurada, além do nome e ângulo da fase atual da Lua. Não retorna porcentagem iluminada nem data da próxima fase. Se houver falha no cálculo, retorna uma resposta em modo degradado.
- `POST /registros-observacao`: exemplo de rota protegida por JWT do Strapi; a gravação do registro ainda não está implementada.
- `GET /eventos`: rota protegida por JWT que consulta os eventos no PostgreSQL e inclui `imagem_url` com a primeira imagem associada e `imagem_urls` com todas as URLs. Depende de as tabelas `eventos` e as relações de mídia existirem no banco; o content-type `Evento` não está definido atualmente em `backend/strapi/app`.

## Encerrar e persistência dos dados

Para parar os containers:

```bash
docker compose --env-file .env -f backend/docker-compose.yml down
```

Os dados do PostgreSQL e os uploads do Strapi ficam em volumes Docker e são preservados ao parar os serviços. Para apagá-los também, use `docker compose --env-file .env -f backend/docker-compose.yml down -v`; isso exclui os dados persistidos.

## Estrutura

```text
.
├── backend/
│   ├── api_python/   # API FastAPI, autenticação JWT e lógica astronômica
│   ├── strapi/
│   │   ├── app/      # Aplicação Strapi e seus content-types
│   │   └── Dockerfile
│   └── docker-compose.yml
├── frontend/         # Aplicação Next.js
└── README.md
```
