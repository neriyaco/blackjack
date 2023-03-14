# Angular client
FROM node:18-alpine as builder

WORKDIR /app
COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY client/ ./
RUN yarn build

# Path: Dockerfile
# Nest.js server
FROM node:18-alpine

WORKDIR /app
COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY server/ ./
COPY --from=builder /app/dist/client ./public
RUN yarn build
ENV NODE_ENV=production

EXPOSE 3000
CMD ["yarn", "start:prod"]