# syntax=docker/dockerfile:1.4
FROM node:lts-slim AS development

WORKDIR /usr/src/app

COPY package.json ./package.json
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3030
ENV NODE_ENV=production
CMD [ "node", "./dist/index.js" ]

FROM development as dev-envs

HEALTHCHECK CMD curl --fail http://localhost:3030 || exit 1

CMD [ "node", "./dist/index.js" ]
