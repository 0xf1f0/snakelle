# Copilot Instructions for Snakelle

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

**Important**: When you are assigned to work on an issue, create your branch following this exact pattern.
