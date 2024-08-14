# syntax=docker/dockerfile:1.4
FROM imbios/bun-node:1.1.22-20-alpine AS development

WORKDIR /usr/src/app

COPY package.json ./package.json
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

EXPOSE 3030
ENV NODE_ENV=production
CMD [ "bun", "start" ]

FROM development as dev-envs

HEALTHCHECK CMD curl --fail http://localhost:3030 || exit 1

CMD [ "bun", "start" ]
