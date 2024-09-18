FROM node:lts-alpine

WORKDIR /app

RUN mkdir -p frontEnd

WORKDIR /app/frontEnd

COPY ../apps/frontEnd/package*.json ./
COPY ../apps/frontEnd/* ./

WORKDIR /app

COPY --chown=node:root ./docker/frontend-entrypoint.sh /docker-entrypoint.sh
RUN dos2unix /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT [ "sh", "/docker-entrypoint.sh" ]