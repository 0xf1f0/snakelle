# Branch Naming Convention Enforcement

## Overview

This project enforces a strict branch naming convention to maintain consistency and traceability between branches and GitHub issues.

## Required Format

```
feature/<issue-number>-<short-description>
```
or
```
copilot/<issue-number>-<short-description>
```

### Components

1. **Prefix**: Either `feature/` or `copilot/`
   - Use `feature/` for human-created branches
   - Use `copilot/` for AI-generated branches
2. **Issue Number**: The GitHub issue number this branch addresses
3. **Short Description**: 2-4 words describing the change
   - Must be lowercase
   - Words separated by hyphens
   - No spaces, underscores, or other separators

## Examples

### ✅ Valid Branch Names

```
feature/1-init-vite-ts
feature/48-game-loop-canvas
copilot/50-emoji-mask
copilot/60-setup-instructions
feature/100-add-user-auth
```

### ❌ Invalid Branch Names

```
bugfix/create-basic-app-shell      # Wrong prefix (use feature/ or copilot/)
feature/init-app                   # Missing issue number
copilot/create-app                 # Missing issue number
feature/1-Init-App                 # Not lowercase
feature/1-single                   # Only 1 word (need 2-4)
feature/1-this-is-too-many-words   # Too many words (need 2-4)
main                               # Not a feature branch
```

## Automated Validation

### GitHub Actions Workflow

The `.github/workflows/branch-naming.yml` workflow automatically validates all pull requests:

**Triggers:**
- Pull request opened
- Pull request edited
- Pull request synchronized
- Pull request reopened

**Validation Steps:**
1. Extract branch name from pull request
2. Check against regex pattern: `^(feature|copilot)/[0-9]+-[a-z]+(-[a-z]+){1,3}$`
3. Validate word count in description (2-4 words)
4. Report success or detailed error message

### Error Messages

When a branch name fails validation, the workflow provides:
- Clear explanation of what's wrong
- The required format
- All naming rules
- Multiple examples of valid names
- Link to documentation

## Pull Request Template

The `.github/pull_request_template.md` includes a checklist item reminding contributors to follow the naming convention.

## How to Fix a Non-Compliant Branch

### Option 1: Create New Branch (Recommended)

```bash
# Create new branch with correct name
git checkout -b feature/<issue-number>-<description>

# Cherry-pick your commits
git cherry-pick <commit-hash>

# Push new branch
git push origin feature/<issue-number>-<description>

# Open new PR and close old one
```

### Option 2: Rename Existing Branch (If Not Shared)

```bash
# Rename current branch
git branch -m feature/<issue-number>-<description>

# Force push to update remote
git push origin -u feature/<issue-number>-<description> --force

# Delete old branch
git push origin --delete old-branch-name

# Update PR to point to new branch
```

## Benefits

1. **Traceability**: Easy to identify which issue a branch addresses
2. **Consistency**: All branches follow the same pattern
3. **Automation**: CI/CD can extract issue numbers for automatic linking
4. **Clarity**: Branch purpose is immediately clear from the name
5. **Organization**: Easy to filter and search branches

## Testing the Pattern

You can test branch names locally using this script:

```bash
#!/bin/bash
BRANCH_NAME="feature/123-test-branch"

if [[ "$BRANCH_NAME" =~ ^feature/[0-9]+-[a-z]+(-[a-z]+){1,3}$ ]]; then
  echo "✓ Valid branch name"
else
  echo "✗ Invalid branch name"
fi
```

## References

- Copilot Instructions: `.github/copilot-instructions.md`
- GitHub Configuration: `.github/README.md`
- Branch Naming Workflow: `.github/workflows/branch-naming.yml`
