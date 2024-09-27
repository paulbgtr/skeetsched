FROM oven/bun:alpine

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY . .

CMD ["bun", "dev"]