FROM oven/bun:1 AS base
WORKDIR /backend

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun x prisma generate

USER bun
EXPOSE 8000
ENTRYPOINT [ "bun", "run", "src/app.ts" ]