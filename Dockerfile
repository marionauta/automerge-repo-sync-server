# syntax=docker/dockerfile:1.4
FROM oven/bun:1.1.24-alpine

RUN apk add --no-cache libstdc++

WORKDIR /usr/src/app

COPY . .
RUN bun install --frozen-lockfile

ENV NODE_ENV=production
RUN bun compile

EXPOSE 3030
CMD [ "./sync-server" ]
HEALTHCHECK CMD curl --fail http://localhost:3030 || exit 1
