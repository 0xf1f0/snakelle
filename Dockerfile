# Development Dockerfile for snakelle
FROM node:20-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY apps/worker/package.json ./apps/worker/
COPY packages/game-core/package.json ./packages/game-core/
COPY packages/shared/package.json ./packages/shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command
CMD ["pnpm", "run", "dev"]
