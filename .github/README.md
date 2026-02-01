# GitHub Configuration for Snakelle

This directory contains GitHub-specific configuration files for the Snakelle project.

## Files

### `copilot-instructions.md`
Instructions for GitHub Copilot agents working on this repository. Contains the branch naming convention and other project-specific guidelines.

### `workflows/branch-naming.yml`
GitHub Actions workflow that automatically validates branch names on pull requests.

**What it checks:**
- Branch name starts with `feature/`
- Includes an issue number after the prefix
- Short description is lowercase, hyphen-separated, and 2-4 words only

**When it runs:**
- On pull request opened, edited, synchronize, or reopened events

**Example valid branches:**
- `feature/1-init-vite-ts`
- `feature/48-game-loop-canvas`
- `feature/50-emoji-mask`

**Example invalid branches:**
- `copilot/create-basic-app-shell` (wrong prefix)
- `feature/init-app` (missing issue number)
- `feature/1-Init-App` (not lowercase)
- `feature/1-this-is-too-many-words` (too many words)

### `pull_request_template.md`
Template for pull request descriptions. Automatically loads when creating a new PR and includes a checklist reminder about the branch naming convention.

## Branch Naming Enforcement

The branch naming convention is enforced automatically through GitHub Actions. If your PR's branch name doesn't follow the convention, the check will fail with a detailed error message explaining the required format.

To fix a non-compliant branch:
1. Create a new branch with the correct name: `git checkout -b feature/<issue-number>-<description>`
2. Cherry-pick your commits: `git cherry-pick <commit-hash>`
3. Push the new branch and open a new PR
4. Close the old PR

Alternatively, you can rename your current branch locally and force push (if you haven't shared it with others):
1. Rename: `git branch -m feature/<issue-number>-<description>`
2. Force push: `git push origin -u feature/<issue-number>-<description>`
3. Update your PR to point to the new branch
