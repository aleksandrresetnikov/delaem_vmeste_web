# Используем официальный образ Bun
# Все версии: https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Этап установки зависимостей (кешируемый слой)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Этап сборки (включая devDependencies)
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN bun run build

# Финальный образ (только production)
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/public ./public
COPY --from=build /usr/src/app/package.json .

# Запуск приложения
EXPOSE 3000
CMD ["bun", "run", "start"]