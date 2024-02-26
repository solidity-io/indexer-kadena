FROM node:18 as builder
WORKDIR /app
COPY indexer/package.json yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn global add typescript
COPY indexer .
RUN yarn build

FROM node:18-slim
WORKDIR /app
COPY indexer/package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/config/global-bundle.pem ./dist/config/global-bundle.pem
EXPOSE 3000

#CMD ["node", "dist/index.js", "--startFill"]
