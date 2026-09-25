FROM node:20-alpine

WORKDIR /app

# Dependências nativas que o Strapi precisa pra compilar alguns pacotes
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

EXPOSE 1337

CMD ["sh", "-c", "if [ ! -f package.json ]; then npx create-strapi-app@latest . --quickstart --no-run --skip-cloud --typescript; fi && npm run develop"]
