# Contributing to Snakelle

Thank you for your interest in contributing to Snakelle! This document provides guidelines for contributing to the project.

## Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/snakelle.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Make your changes
6. Build and test: `npm run build`
7. Create a pull request

## Branch Naming Convention

**All feature branches must follow this naming convention:**

```
feature/<issue-number>-<short-description>
```

### Rules
- Use the `feature/` prefix
- Include the GitHub issue number
- Add a short description (2-4 lowercase, hyphen-separated words)

### Examples
- ✅ `feature/1-init-vite-ts`
- ✅ `feature/48-game-loop-canvas`
- ✅ `feature/50-emoji-mask`
- ❌ `copilot/create-basic-app-shell` (wrong prefix)
- ❌ `feature/init-app` (missing issue number)
- ❌ `feature/1-Init-App` (not lowercase)

**Note:** Branch naming is automatically validated by GitHub Actions. Non-compliant branches will fail CI checks.

See [docs/BRANCH_NAMING.md](docs/BRANCH_NAMING.md) for detailed information.

## Working with GitHub Copilot

This repository is optimized for GitHub Copilot coding agents. Before starting work:

1. **Read the Copilot Instructions**: See [.github/copilot-instructions.md](.github/copilot-instructions.md) for:
   - Project architecture and structure
   - Code standards and conventions
   - Development workflow
   - Tasks well-suited for Copilot
   - Guidelines for creating issues

2. **Create Well-Scoped Issues**: When creating issues for Copilot to work on, include:
   - Clear problem description
   - Acceptance criteria
   - File references (if known)
   - Context about how it relates to existing code
   - Testing requirements

## Development Workflow

### Before Committing

**Always run the build before committing:**

```bash
npm run build
```

The project must compile with zero TypeScript errors.

### Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start Vite dev server with hot module reloading
- `npm run build` - TypeScript compilation + Vite production build
- `npm run preview` - Preview production build locally

## Code Standards

### TypeScript Requirements

1. **Strict mode enabled** - All code must pass strict type checking
2. **Explicit type annotations** - Use clear type annotations for function parameters and return types
3. **No `any` types** - Use proper type definitions instead of `any`
4. **Interface-based design** - Define interfaces for object shapes and contracts

### File Organization

1. Keep files focused and single-purpose
2. Group related functionality in module folders
3. Export clear, minimal public APIs
4. Use descriptive file and class names

### Naming Conventions

- **Classes/Types:** PascalCase (e.g., `GameScreen`, `AppState`)
- **Functions/Variables:** camelCase (e.g., `handleInput`, `gameState`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_GRID_SIZE`)
- **Files:** Match the primary export name (e.g., `GameScreen.ts`)

### Code Quality

1. Write self-documenting code with clear variable and function names
2. Add comments for complex logic or non-obvious behavior
3. Keep functions small and focused on single responsibility
4. Avoid deeply nested conditionals; use early returns

## Pull Request Process

1. **Create an Issue First**: All PRs should reference an issue
2. **Follow Branch Naming**: Use the required `feature/<number>-<description>` format
3. **Fill Out PR Template**: Complete all sections in the pull request template
4. **Verify Build Passes**: Ensure `npm run build` succeeds with no errors
5. **Wait for CI**: All GitHub Actions checks must pass
6. **Address Review Feedback**: Respond to any code review comments

## Project Structure

```
src/
├── main.ts              # Application entry point
├── App.ts               # Main app logic
├── counter.ts           # Utility module
├── style.css            # Global styles
├── app/                 # Application state management
├── emoji/               # Emoji-related utilities and conversion logic
├── game/                # Core game logic and mechanics
├── input/               # Input handling (keyboard, etc.)
├── render/              # Rendering logic and Canvas management
├── screens/             # Screen/scene management
├── services/            # Reusable service modules
└── ui/                  # UI components and helpers
```

## Getting Help

- **Issues**: Browse existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check [.github/copilot-instructions.md](.github/copilot-instructions.md)

## License

By contributing to Snakelle, you agree that your contributions will be licensed under the same license as the project.
