# snakelle

A daily one-shot puzzle game inspired by Snake. Each day, players receive a single target shape and must use a snake-like path on a grid to recreate that shape in one attempt.

## Project Purpose

snakelle is an MVP web-based puzzle game designed to validate core gameplay mechanics, scoring clarity, and daily retention. The game emphasizes simplicity, clarity, and replayability without requiring user signup or social features.

## Tech Stack

This is a production-quality monorepo optimized for solo developer iteration.

- **Monorepo**: pnpm workspace
- **Frontend**: SvelteKit + TypeScript
- **Rendering**: HTML5 Canvas
- **Hosting**: Cloudflare Pages
- **CI/CD**: GitHub Actions
- **Node**: LTS (v20+)
- **Testing**: Vitest

### Architecture

```
/apps
  /web            - SvelteKit application (UI layer)
  /worker         - Cloudflare Worker placeholder
/packages
  /game-core      - Pure TypeScript game logic (no DOM dependencies)
  /shared         - Shared configuration and types
```

**Design Principles:**
- `game-core` must not import browser or DOM APIs
- UI must not contain core game logic
- All constants live in shared config
- Logic must be deterministic and testable

## Local Development

### Prerequisites

- Node.js 20+ LTS
- pnpm 9.0.0 (installed automatically via packageManager field)

### Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The dev server will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development
pnpm run dev          # Start dev server for web app

# Building
pnpm run build        # Build all packages and apps

# Code Quality
pnpm run lint         # Run ESLint across all packages
pnpm run type-check   # Run TypeScript type checking
pnpm run format       # Format code with Prettier

# Testing
pnpm run test         # Run unit tests in packages/game-core
```

## Deployment

### Cloudflare Pages

The web app is configured for deployment to Cloudflare Pages using `@sveltejs/adapter-cloudflare`.

**Build Configuration:**
- Build command: `pnpm run build`
- Build output directory: `apps/web/build`
- Node version: 20

**Deployment:**
1. Connect your GitHub repository to Cloudflare Pages
2. Configure the build settings as above
3. Cloudflare Pages will automatically deploy on push to main

## CI/CD

GitHub Actions workflow runs on all pull requests and pushes to main:

- ✓ Install dependencies with pnpm
- ✓ Run ESLint
- ✓ Run TypeScript type checking
- ✓ Run unit tests

The workflow is configured to fail fast and complete in under 5 minutes.

## Project Structure

```
snakelle/
├── apps/
│   ├── web/               # SvelteKit app
│   │   ├── src/
│   │   │   ├── routes/    # SvelteKit routes
│   │   │   └── app.html   # HTML template
│   │   ├── package.json
│   │   └── svelte.config.js
│   └── worker/            # Cloudflare Worker (placeholder)
├── packages/
│   ├── game-core/         # Game logic
│   │   ├── src/
│   │   │   ├── grid.ts
│   │   │   └── grid.test.ts
│   │   ├── package.json
│   │   └── vitest.config.ts
│   └── shared/            # Shared config and types
│       ├── src/
│       │   ├── config.ts
│       │   ├── types.ts
│       │   └── index.ts
│       └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml         # CI workflow
├── pnpm-workspace.yaml    # Workspace config
├── tsconfig.base.json     # Base TypeScript config
├── .eslintrc.json         # ESLint config
├── .prettierrc.json       # Prettier config
└── package.json           # Root package
```

## Contributing

This is a solo developer project, but contributions are welcome. Please ensure:

- All tests pass (`pnpm run test`)
- Code is linted (`pnpm run lint`)
- Types are valid (`pnpm run type-check`)
- Code is formatted (`pnpm run format`)

## License

MIT
