FROM node:lts-alpine

WORKDIR /app

RUN mkdir -p backEnd

WORKDIR /app/backEnd

COPY ../apps/backEnd/package*.json ./
COPY ../apps/backEnd/* ./

WORKDIR /app

COPY --chown=node:root ./docker/backend-entrypoint.sh /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]