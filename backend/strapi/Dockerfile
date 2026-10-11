FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git

EXPOSE 1337

CMD ["sh", "-c", "\
  if [ ! -f package.json ]; then \
    npx create-strapi-app@4 . --no-run --skip-cloud --typescript \
      --dbclient=postgres \
      --dbhost=$DATABASE_HOST \
      --dbport=$DATABASE_PORT \
      --dbname=$DATABASE_NAME \
      --dbusername=$DATABASE_USERNAME \
      --dbpassword=$DATABASE_PASSWORD; \
  fi && \
  npm run develop \
"]