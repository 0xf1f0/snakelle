# Snakelle Monorepo

This is a pnpm-based monorepo for the Snakelle project.

## Getting Started

To get started, install the necessary dependencies:

```bash
pnpm install
```

## Apps and Packages

- **apps/**: Contains application-specific code.
- **packages/**: Contains shared libraries and utilities.

## Project Management

This project uses a Kanban board workflow for managing development tasks.

### Workflow Columns

1. **Backlog** - Everything not yet ready to work
2. **Ready** - Well-defined, unblocked, next up
3. **In Progress** - Max 1–2 issues at a time (solo dev rule)
4. **Review / Verify** - Manual testing, acceptance criteria check
5. **Done** - Meets AC, merged, deployed if applicable

### Solo Developer Rule

⚠️ **Maximum 2 issues in "In Progress" at any time** - This is a guardrail to prevent context-switching and maintain focus.

### Documentation

- **Setup Guide**: [.github/PROJECT_BOARD_CONFIG.md](.github/PROJECT_BOARD_CONFIG.md)
- **Workflow Guide**: [.github/KANBAN_WORKFLOW_GUIDE.md](.github/KANBAN_WORKFLOW_GUIDE.md)
- **Configuration**: [.github/kanban-board-config.json](.github/kanban-board-config.json)

To set up the project board, see the setup instructions in [PROJECT_BOARD_CONFIG.md](.github/PROJECT_BOARD_CONFIG.md) or run:

```bash
.github/setup-kanban-board.sh
```

## CI Configuration

Continuous Integration setup might be added here.

## Contributing

Contributions are welcome! Please make sure to follow the [contribution guidelines](./CONTRIBUTING.md).
