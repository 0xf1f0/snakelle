#!/bin/bash

# GitHub Project Board Setup Script
# This script helps set up labels and provides instructions for the Kanban board

set -euo pipefail

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Snakelle Kanban Board Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) is not installed."
    echo "   Please install it from: https://cli.github.com/"
    echo ""
    echo "Manual setup instructions:"
    echo "1. Create labels manually on GitHub"
    echo "2. Set up the project board"
    echo "3. Configure columns"
    echo ""
    exit 1
fi

echo "📋 Step 1: Creating workflow labels..."
echo ""

# Create labels for workflow tracking
gh label create "in-progress" \
    --description "Issue is currently being worked on" \
    --color "FFA500" \
    --force 2>/dev/null || echo "  ℹ️  Label 'in-progress' already exists"

gh label create "ready" \
    --description "Issue is ready to be worked on" \
    --color "0E8A16" \
    --force 2>/dev/null || echo "  ℹ️  Label 'ready' already exists"

gh label create "backlog" \
    --description "Issue is in the backlog" \
    --color "D4C5F9" \
    --force 2>/dev/null || echo "  ℹ️  Label 'backlog' already exists"

gh label create "review-verify" \
    --description "Issue is in review/verification" \
    --color "8B4789" \
    --force 2>/dev/null || echo "  ℹ️  Label 'review-verify' already exists"

gh label create "wip-limit-exceeded" \
    --description "Work in progress limit has been exceeded" \
    --color "B60205" \
    --force 2>/dev/null || echo "  ℹ️  Label 'wip-limit-exceeded' already exists"

echo ""
echo "✅ Labels created successfully!"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Manual Setup Required"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "GitHub Projects (v2) must be set up manually through the web interface."
echo ""
echo "Follow these steps:"
echo ""

# Get repository URL with error handling
REPO_URL="https://github.com/0xf1f0/snakelle"
if command -v gh &> /dev/null && gh auth status &> /dev/null; then
    REPO_URL="https://github.com/$(gh repo view --json owner,name -q '.owner.login + "/" + .name' 2>/dev/null || echo '0xf1f0/snakelle')"
fi

echo "1. 🌐 Go to: ${REPO_URL}/projects"
echo ""
echo "2. ➕ Click 'New project'"
echo ""
echo "3. 📋 Select 'Board' template"
echo ""
echo "4. 📝 Name it: 'Snakelle MVP Development'"
echo ""
echo "5. 🏗️  Configure columns in this exact order:"
echo "   ├─ Backlog (Everything not yet ready to work)"
echo "   ├─ Ready (Well-defined, unblocked, next up)"
echo "   ├─ In Progress (Max 1–2 issues at a time)"
echo "   ├─ Review / Verify (Manual testing, AC check)"
echo "   └─ Done (Meets AC, merged, deployed)"
echo ""
echo "6. ⚙️  Set up automations:"
echo "   └─ Auto-add new issues to 'Backlog'"
echo ""
echo "7. 📚 Read the documentation:"
echo "   ├─ .github/PROJECT_BOARD_CONFIG.md"
echo "   ├─ .github/KANBAN_WORKFLOW_GUIDE.md"
echo "   └─ .github/kanban-board-config.json"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Automation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "WIP Limit Check workflow has been configured:"
echo "└─ .github/workflows/wip-limit-check.yml"
echo ""
echo "This workflow will:"
echo "• Monitor the 'in-progress' label"
echo "• Warn when more than 2 issues are in progress"
echo "• Add 'wip-limit-exceeded' label when limit is violated"
echo "• Post reminder comments about the Solo Developer Rule"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Setup complete! Read the guides to learn the workflow."
echo ""
