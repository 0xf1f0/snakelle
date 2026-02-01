# Copilot Instructions for Snakelle

Snakelle is a web-based emoji snake game built with Vite and TypeScript. Follow these guidelines when contributing to the project.

## Project Overview

**Tech Stack:**
- Vite 7.x for fast bundling and development
- TypeScript 5.9+ for type-safe JavaScript
- Vanilla JavaScript/TypeScript (no framework)
- CSS for styling

**Purpose:** An emoji-based snake game with emoji-to-mask conversion mechanics and multiple game screens.

## Development Setup

### Required Before Each Commit
- Run `npm run build` to ensure TypeScript compilation succeeds without errors
- Verify no TypeScript errors appear in the output
- The project must compile cleanly with zero type errors

### Development Flow
- **Install:** `npm install`
- **Dev server:** `npm run dev` (Vite dev server for hot module reloading)
- **Build:** `npm run build` (TypeScript compilation + Vite bundling)
- **Preview:** `npm run preview` (preview production build)

## Repository Structure

```
src/
├── main.ts              # Application entry point
├── App.ts               # Main app logic
├── counter.ts           # Utility module
├── style.css            # Global styles
├── app/
│   └── AppState.ts      # Application state management
├── emoji/               # Emoji-related utilities and conversion logic
├── game/                # Core game logic and mechanics
├── input/               # Input handling (keyboard, etc.)
├── render/              # Rendering logic and Canvas management
├── screens/             # Screen/scene management
│   ├── GameScreen.ts
│   ├── LandingScreen.ts
│   └── LevelSelectScreen.ts
├── services/            # Reusable service modules
└── ui/                  # UI components and helpers

public/                  # Static assets
```

## Code Standards and Conventions

### TypeScript Requirements
1. **Strict mode enabled** - All code must pass TypeScript strict type checking
2. **Type annotations** - Use explicit type annotations for function parameters and return types
3. **No `any` types** - Avoid `any` type; use proper type definitions instead
4. **Interface-based design** - Use interfaces for object shapes and contracts

### File Organization
1. Keep files focused and single-purpose
2. Group related functionality within module folders (e.g., `emoji/`, `game/`, `input/`)
3. Export clear, minimal public APIs from each module
4. Use descriptive file and class names

### Naming Conventions
- **Classes/Types:** PascalCase (e.g., `GameScreen`, `AppState`)
- **Functions/Variables:** camelCase (e.g., `handleInput`, `gameState`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_GRID_SIZE`, `GAME_SPEED`)
- **Files:** Match the primary export name (e.g., `GameScreen.ts` exports `GameScreen`)

### Code Quality
1. Write self-documenting code with clear variable and function names
2. Add comments for complex logic or non-obvious behavior
3. Keep functions small and focused on a single responsibility
4. Avoid deeply nested conditionals; use early returns

## Suitable Tasks for Copilot

Copilot works well on these types of tasks:

✅ **Well-Suited Tasks:**
- Adding new UI screens or components
- Implementing game mechanics or features
- Creating utility functions and helpers
- Writing input handling or event listeners
- Improving rendering logic or Canvas operations
- Fixing specific bugs with clear reproduction steps
- Adding or updating documentation
- Refactoring isolated modules
- Updating CSS and styling

❌ **Not Recommended (do yourself or review closely):**
- Major architectural changes or refactoring across multiple modules
- Complex state management redesigns
- Changing game physics or core game loop behavior
- Introducing new external dependencies
- Production-critical changes without thorough testing
- Tasks requiring deep understanding of game design decisions

## Branch Naming Convention

When creating branches for issues, **always** follow this naming convention:

```
feature/<issue-number>-<short-description>
```

### Rules for branch names:
- Use the `feature/` prefix
- Include the issue number after the prefix
- Add a hyphen followed by a short description
- The short description must be:
  - **lowercase**
  - **hyphen-separated**
  - **2-4 words only**

### Examples:
- `feature/1-init-vite-ts` for issue #1 "Initialize Snakelle frontend project (Vite + TypeScript)"
- `feature/48-game-loop-canvas` for issue #48 "Implement core game loop and Canvas renderer for rectangular grid"
- `feature/50-emoji-mask` for issue #50 "Implement emoji → mask conversion and EmojiMetadata"

### Automated Enforcement

Branch naming is automatically validated by the GitHub Actions workflow (`.github/workflows/branch-naming.yml`). Pull requests with non-compliant branch names will fail the check until the branch is renamed.

## Guidelines for Issues

When creating issues for Copilot to work on, ensure they include:

1. **Clear problem description** - What needs to be built or fixed?
2. **Acceptance criteria** - What does "done" look like?
3. **File references** - Which files should be modified (if known)?
4. **Context** - How does this relate to existing code or game mechanics?
5. **Testing requirements** - Should unit tests be added? How to verify manually?

Example well-scoped issue:
> **Add pause functionality to GameScreen**
> 
> Add ability to pause/resume the game using the spacebar. When paused, render "PAUSED" text centered on canvas. Add isPaused boolean to AppState. Update GameScreen to check this state and skip game update logic when paused.
>
> **Files to modify:** `src/app/AppState.ts`, `src/screens/GameScreen.ts`, `src/input/` (add spacebar listener)
>
> **Acceptance:** Game pauses on spacebar, resumes on next spacebar press, PAUSED text displays
