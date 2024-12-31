FROM node:18-alpine as builder
WORKDIR /app
COPY indexer yarn.lock ./
RUN rm -rf node_modules && yarn install --frozen-lockfile
RUN npx graphql-codegen
RUN yarn build

FROM node:18-alpine
WORKDIR /app
COPY indexer/package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config/global-bundle.pem ./dist/config/global-bundle.pem
COPY --from=builder /app/src/kadena-server/config/schema.graphql ./dist/kadena-server/config/schema.graphql
EXPOSE 3001

CMD ["node", "dist/index.js", "--graphql"]
