# Kanban Workflow Guide

This guide explains how to use the Kanban board for the Snakelle MVP development.

## Quick Start

### For Solo Developers

1. **Review the board** at the start of each work session
2. **Check "In Progress"** - you should have 1-2 items maximum
3. **Pick from "Ready"** when you have capacity (< 2 in progress)
4. **Move cards** as you progress through work
5. **Respect the WIP limit** to maintain focus

### Daily Workflow

```
Morning:
├─ Review board status
├─ Check In Progress (should be ≤ 2)
├─ Review Ready column for next work
└─ Plan the day's focus

During Work:
├─ Update card status as you progress
├─ Move to Review/Verify when ready for testing
└─ Keep notes on cards about progress/blockers

End of Day:
├─ Update all cards with current status
├─ Move completed work to appropriate columns
└─ Prepare Ready items for tomorrow
```

## Column Definitions

### 🗂️ Backlog
**"Everything not yet ready to work"**

This is your idea parking lot and future work queue.

**What goes here:**
- New feature ideas
- Bugs that aren't critical
- Issues that need more definition
- Work that has dependencies
- Low-priority items

**What doesn't go here:**
- Issues ready to be worked
- Critical bugs (those go to Ready)
- Work in progress

**When to move out:**
- When you've defined acceptance criteria
- When dependencies are resolved
- When the item is prioritized for work

### ✅ Ready
**"Well-defined, unblocked, next up"**

Your ready-to-work queue. These issues are fully specified.

**What goes here:**
- Issues with clear acceptance criteria
- No blockers or dependencies
- Fully researched and scoped
- Prioritized for implementation

**What doesn't go here:**
- Vague or poorly defined issues
- Issues with blockers
- Work already in progress

**When to move out:**
- When you start working on it (→ In Progress)
- When priorities change (→ Backlog)

### 🚧 In Progress
**"Max 1–2 issues at a time (solo dev rule)"**

Your active work. This is where the magic happens.

**What goes here:**
- Issues you are actively coding
- Work with an open branch/PR
- Tasks you're working on today

**⚠️ CRITICAL RULE:**
- **Maximum 2 issues** in this column
- This is not negotiable for solo developers
- Focus over multitasking

**What doesn't go here:**
- Work waiting for review
- Blocked work (move back to Ready or Backlog)
- More than 2 issues (seriously!)

**When to move out:**
- When code is complete (→ Review/Verify)
- When blocked (→ Ready or Backlog)
- When abandoning the work (→ Backlog)

### 🔍 Review / Verify
**"Manual testing, acceptance criteria check"**

Quality gate before completion.

**What goes here:**
- PRs awaiting review
- Code ready for testing
- Work being validated against acceptance criteria
- Changes awaiting deployment

**What doesn't go here:**
- Work still being coded
- Issues not ready for review

**When to move out:**
- When approved and merged (→ Done)
- When changes are requested (→ In Progress)

### ✨ Done
**"Meets AC, merged, deployed if applicable"**

Completed work. Celebrate! 🎉

**What goes here:**
- Merged pull requests
- Deployed features
- Verified bug fixes
- Work meeting all acceptance criteria

**What doesn't go here:**
- Work that's "mostly done"
- Unmerged PRs
- Undeployed features (unless deployment isn't required)

**When to move out:**
- Generally never - this is the end state
- Only if reopening work (→ In Progress or Ready)

## The Solo Developer Rule

### Why Maximum 2 Issues in Progress?

**Context switching is expensive:**
- Takes 15-30 minutes to regain focus after switching
- Increases mistakes and bugs
- Reduces overall throughput
- Creates cognitive overhead

**Better to finish 2 things than start 5:**
- Completed work provides value
- WIP doesn't provide value until done
- Finishing work creates momentum
- Unfinished work creates anxiety

### What if I exceed the limit?

The GitHub Actions workflow will:
1. ⚠️ Post a warning comment
2. 🏷️ Add a `wip-limit-exceeded` label
3. 📊 List all in-progress issues

**Your action:**
1. **Stop** - Don't start anything new
2. **Focus** - Pick one issue to complete
3. **Push forward** - Get it to Review/Verify
4. **Repeat** - Get count back to 1-2

### Legitimate Exceptions

Sometimes you might have 2+ issues in progress:
- **Quick critical fix** while main work continues
- **Waiting for CI/deployment** on one issue
- **Dependency blocked** temporarily

In these cases:
- Acknowledge the exception
- Have a plan to get back to ≤2
- Don't let it become the norm

## Best Practices

### Issue Management

**Write good acceptance criteria:**
```markdown
## Acceptance Criteria
- [ ] Feature works as described
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No regressions introduced
```

**Keep cards updated:**
- Add comments about progress
- Note blockers immediately
- Update estimates if needed
- Link related PRs

**Use labels effectively:**
- `in-progress` - Currently working
- `blocked` - Can't proceed
- `needs-review` - Ready for eyes
- `wip-limit-exceeded` - Too much WIP

### Weekly Review

**Every week, review the board:**

1. **Backlog grooming**
   - Are there items ready to move to Ready?
   - Can any be closed/archived?
   - Are descriptions still accurate?

2. **Ready prioritization**
   - What should be worked next?
   - Are items still well-defined?
   - Any new dependencies?

3. **In Progress check**
   - Has WIP limit been respected?
   - Any items stuck?
   - Any blockers to remove?

4. **Review/Verify**
   - What's waiting too long?
   - Can we speed up reviews?
   - Any forgotten items?

5. **Done celebration**
   - What was completed?
   - What worked well?
   - What to improve?

## Metrics to Track (Optional)

If you want to optimize your workflow:

- **Cycle time**: Ready → Done time per issue
- **WIP limit violations**: How often exceeded
- **Column age**: How long issues stay in each column
- **Throughput**: Issues completed per week

## Getting Help

- **Configuration**: See `.github/PROJECT_BOARD_CONFIG.md`
- **Technical setup**: See `.github/kanban-board-config.json`
- **Automation**: See `.github/workflows/wip-limit-check.yml`

## Philosophy

> "Stop starting, start finishing" - Personal Kanban principle

This workflow is designed for focus, flow, and finishing. The WIP limit is the key constraint that makes everything else work. Respect it, and you'll be amazed at how much you accomplish.
