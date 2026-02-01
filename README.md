# Snakelle

Eat the emoji, one cell at a time.

## Getting Started

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Branch Naming Convention

When working on issues in this repository, please follow this branch naming convention:

```
feature/<issue-number>-<short-description>
```

The short description should be:
- **lowercase**
- **hyphen-separated**
- **a few words only** (typically 2-4 words)

### Examples

- `feature/1-init-vite-ts` for issue #1 "Initialize Snakelle frontend project (Vite + TypeScript)"
- `feature/48-game-loop-canvas` for issue #48 "Implement core game loop and Canvas renderer for rectangular grid"
- `feature/50-emoji-mask` for issue #50 "Implement emoji → mask conversion and EmojiMetadata"

**Note:** Branch names are automatically validated by GitHub Actions. Pull requests with non-compliant branch names will fail the check. See [docs/BRANCH_NAMING.md](docs/BRANCH_NAMING.md) for details.
