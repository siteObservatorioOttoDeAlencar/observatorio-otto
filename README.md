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
   docker compose build
   docker compose run --rm --no-deps strapi npm ci
   ```

   Execute novamente `npm ci` quando as dependências em `strapi/app/package.json` ou `strapi/app/package-lock.json` forem alteradas.

## Executar o projeto

Na raiz do repositório, inicie os serviços:

```bash
docker compose up --build
```

Na primeira inicialização, o Strapi pode levar alguns minutos para iniciar enquanto configura o ambiente. Para acompanhar os logs:

```bash
docker compose logs -f
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
- `GET /pagina-inicial`: retorna o conteúdo publicado da página inicial do Strapi (`titulo` e `texto_apresentacao`) com os arquivos vinculados em `imagem_destaque`.
- `POST /registros-observacao`: exemplo de rota protegida por JWT do Strapi; a gravação do registro ainda não está implementada.

## Encerrar e persistência dos dados

Para parar os containers:

```bash
docker compose down
```

Os dados do PostgreSQL e os uploads do Strapi ficam em volumes Docker e são preservados ao parar os serviços. Para apagá-los também, use `docker compose down -v`; isso exclui os dados persistidos.

## Estrutura

```text
.
├── api_python/       # API FastAPI, autenticação JWT e lógica astronômica
├── strapi/
│   ├── app/          # Aplicação Strapi e seus content-types
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```
