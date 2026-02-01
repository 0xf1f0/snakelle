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

### First-Time Setup
**CRITICAL:** Before running any commands, you MUST install dependencies:
```bash
npm install
```

Without installing dependencies, TypeScript compilation will fail with errors like:
```
error TS2688: Cannot find type definition file for 'vite/client'
```

### Required Before Each Commit
- Run `npm run build` to ensure TypeScript compilation succeeds without errors
- Verify no TypeScript errors appear in the output
- The project must compile cleanly with zero type errors

### Development Flow
- **Install:** `npm install` (MUST run this first before any other commands)
- **Dev server:** `npm run dev` (Vite dev server for hot module reloading)
- **Build:** `npm run build` (TypeScript compilation + Vite bundling)
- **Preview:** `npm run preview` (preview production build)

### Testing and Linting
- **No linting tools:** This project does not use ESLint, Prettier, or other linters
- **No test framework:** There are no unit tests or test runners configured (Jest, Vitest, etc.)
- **Type checking only:** TypeScript strict mode (`tsc`) is the only automated validation
- **Manual testing:** Verify changes by running `npm run dev` and testing in the browser

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

## Git Workflow and Best Practices

### Branch Workflow
1. **ALWAYS** work on the branch that was created for your issue
2. **NEVER** create new branches - work on the existing branch for your task
3. **NEVER** merge or push directly to `main` or `master`
4. Use `git status` and `git diff` frequently to review your changes before committing

### Common Git Commands
```bash
# Check current status
git status

# View changes (ALWAYS use --no-pager to avoid interactive pager)
git --no-pager diff
git --no-pager log --oneline -10

# Stage specific files (avoid 'git add .')
git add src/specific/file.ts

# Check which files will be committed
git --no-pager diff --cached
```

### .gitignore
The repository `.gitignore` excludes:
- `node_modules/` - Never commit dependencies
- `dist/` - Never commit build artifacts
- Various log and cache files

If you accidentally stage unwanted files, use `git reset HEAD <file>` to unstage them.

## Troubleshooting Common Errors

### Build Errors

**Error:** `Cannot find type definition file for 'vite/client'`
- **Cause:** Dependencies not installed
- **Fix:** Run `npm install` before building

**Error:** TypeScript compilation errors
- **Cause:** Strict mode violations (missing types, unused variables, etc.)
- **Fix:** Address each error individually. Common fixes:
  - Add explicit type annotations
  - Remove unused imports/variables
  - Handle potential `null`/`undefined` cases

### Development Server Issues

**Error:** Port already in use
- **Cause:** Previous dev server still running
- **Fix:** Kill the process or use a different port with `npm run dev -- --port 3001`

**Error:** Module not found during dev
- **Cause:** Import path errors or missing files
- **Fix:** Check import paths are correct and files exist

## Architecture and State Management

### State Management Pattern
The app uses a simple observer pattern for state management:

- **AppState** (`src/app/AppState.ts`): Global app state (current screen, selected level)
  - Uses observer pattern with `subscribe()` and `setScreen()` methods
  - Centralized state manager exported as singleton `appState`
  
- **GameState** (`src/game/state.ts`): Game-specific state (snake, visited cells, status)
  - Created fresh for each game session
  - Immutable updates in game loop

**Key Principle:** App state is global and reactive; game state is local and updated via pure functions.

### Screen Management
Screens are created as DOM elements via factory functions:
- `createLandingScreen()` - Landing/home screen
- `createLevelSelectScreen()` - Level selection screen
- `createGameScreen(level)` - Active game screen with Canvas

The `App` class listens to `appState` changes and swaps screen elements in the DOM.

### Canvas Rendering
Game rendering uses HTML5 Canvas (`src/render/board.ts`):
- Canvas element created in `GameScreen`
- Rendering happens in the game loop
- Uses `requestAnimationFrame` for smooth animation
- Grid-based coordinate system (cells, not pixels)

### Input Handling
Keyboard input (`src/input/keyboard.ts`):
- Event listeners added/removed when screens mount/unmount
- Direction changes queued to prevent rapid invalid turns
- Follows standard WASD + Arrow keys pattern

## Common Patterns and Conventions

### Exporting Modules
Most files export:
- **Types/Interfaces** - Always PascalCase
- **Functions** - camelCase, often factory functions like `createGameState()`
- **Constants** - UPPER_SNAKE_CASE for true constants

Example:
```typescript
export interface GameState { ... }
export type Direction = 'up' | 'down' | 'left' | 'right';
export const DEFAULT_BOARD_WIDTH = 16;
export function createGameState(): GameState { ... }
```

### File Structure Pattern
Each module typically has:
1. Type/interface definitions at the top
2. Constants
3. Pure functions that operate on those types
4. Factory functions or classes at the bottom

### No Global Side Effects
Files should not execute code on import. Use factory functions or explicit initialization.

## Working with Dependencies

### Adding Dependencies
When adding new dependencies:
1. Use exact versions: `npm install --save-exact package-name`
2. Check if it's a dev dependency: `npm install --save-dev --save-exact package-name`
3. Always run `npm run build` after adding dependencies
4. Update documentation if the dependency changes the build process

### Current Dependencies
- **vite** `^7.2.4` - Build tool and dev server
- **typescript** `~5.9.3` - Type checking and compilation

**Note:** This is a minimal dependency project. Avoid adding new dependencies unless absolutely necessary.

## Error Documentation

### Errors Encountered During Onboarding

**Issue:** Build fails immediately after cloning repository
- **Error Message:** `Cannot find type definition file for 'vite/client'`
- **Root Cause:** Dependencies not installed in fresh clone
- **Solution:** Always run `npm install` before any other command
- **Prevention:** Updated documentation to emphasize this as first step
