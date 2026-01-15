# Kanban Board Visual Reference

## Board Layout

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│   BACKLOG   │    READY    │ IN PROGRESS │REVIEW/VERIFY│    DONE     │
│             │             │             │             │             │
│  Everything │Well-defined,│Max 1-2 items│Manual test, │  Meets AC,  │
│  not ready  │ unblocked,  │   at a time │   AC check  │   merged,   │
│   to work   │   next up   │ (solo rule) │             │  deployed   │
│             │             │             │             │             │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│             │             │             │             │             │
│ □ Idea #1   │ ✓ Issue #5  │ ⚡ Issue #10│ 🔍 Issue #7 │ ✅ Issue #2 │
│ □ Idea #2   │ ✓ Issue #6  │ ⚡ Issue #11│             │ ✅ Issue #3 │
│ □ Bug #3    │ ✓ Issue #8  │             │             │ ✅ Issue #4 │
│ □ Feature#4 │             │             │             │             │
│             │             │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## Workflow Flow Diagram

```
    ┌─────────────┐
    │   BACKLOG   │
    │             │
    │  Not ready  │
    │   to work   │
    └──────┬──────┘
           │
           │ When fully defined
           │ & dependencies resolved
           ▼
    ┌─────────────┐
    │    READY    │
    │             │
    │ Well-defined│
    │  unblocked  │
    └──────┬──────┘
           │
           │ Start work
           │ (Check: < 2 in progress)
           ▼
    ┌─────────────┐
    │IN PROGRESS  │◄────┐
    │             │     │
    │ Max 2 items │     │ Changes needed
    │ ⚠️ WIP LIMIT │     │
    └──────┬──────┘     │
           │            │
           │ Code complete │
           │ PR opened   │
           ▼            │
    ┌─────────────┐    │
    │REVIEW/VERIFY│────┘
    │             │
    │ Test & check│
    │      AC     │
    └──────┬──────┘
           │
           │ Approved & merged
           │
           ▼
    ┌─────────────┐
    │    DONE     │
    │             │
    │  Completed  │
    │   & merged  │
    └─────────────┘
```

## Solo Developer Rule Visualization

### ✅ GOOD - Respecting the WIP Limit

```
IN PROGRESS (2/2)
├─ 🔨 Implement feature X
└─ 🐛 Fix bug in component Y

Status: ✅ At capacity, finish before starting new work
```

### ⚠️ WARNING - WIP Limit Exceeded

```
IN PROGRESS (3/2) ⚠️
├─ 🔨 Implement feature X
├─ 🐛 Fix bug in component Y  
└─ 🎨 Refactor module Z

Status: ⚠️ LIMIT EXCEEDED - Focus on completing items!
Action: Move items to Review/Verify or stop new work
```

## Column Capacity Guidelines

| Column        | Recommended Capacity | Hard Limit |
|---------------|---------------------|------------|
| Backlog       | Unlimited           | None       |
| Ready         | 3-5 items           | None       |
| In Progress   | 1-2 items           | **2**      |
| Review/Verify | 1-3 items           | None       |
| Done          | Archive weekly      | None       |

## State Transitions

### Valid Transitions

```
Backlog → Ready          ✅ When issue is fully defined
Ready → In Progress      ✅ When starting work (check WIP limit)
In Progress → Review     ✅ When code is complete
Review → In Progress     ✅ When changes are needed
Review → Done            ✅ When approved and merged
Done → In Progress       ⚠️ Only when reopening work (rare)
```

### Invalid Transitions (Avoid)

```
Backlog → In Progress    ❌ Should go through Ready first
Backlog → Done           ❌ Work must go through proper flow
In Progress → Done       ❌ Must be reviewed/verified first
Ready → Done             ❌ Work must be done first
```

## Labels and Their Meanings

| Label              | Color  | Meaning                          |
|--------------------|--------|----------------------------------|
| `backlog`          | Purple | Issue is in backlog              |
| `ready`            | Green  | Issue is ready to be worked      |
| `in-progress`      | Orange | Issue is being actively worked   |
| `review-verify`    | Purple | Issue is in review/verification  |
| `wip-limit-exceeded`| Red   | Too many issues in progress      |

## Quick Reference

### When to Move Cards

| Trigger                          | Action                   |
|----------------------------------|--------------------------|
| New idea/bug                     | Add to **Backlog**       |
| Issue fully defined              | Move to **Ready**        |
| Starting work (< 2 in progress)  | Move to **In Progress**  |
| Code complete, PR open           | Move to **Review/Verify**|
| Review needs changes             | Move to **In Progress**  |
| Approved, merged, deployed       | Move to **Done**         |

### Red Flags 🚩

- **3+ issues in In Progress** → WIP limit violation
- **Issues stuck in Review/Verify > 1 week** → Process bottleneck
- **Ready column empty** → Need to groom backlog
- **No items moving to Done** → Check for blockers

## Color Coding (Suggested)

```
🔵 Ready        - Blue (calm, prepared)
🟡 In Progress  - Yellow (active, attention)
🟣 Review       - Purple (thoughtful, careful)
🟢 Done         - Green (success, complete)
⚪ Backlog      - Gray (future, low priority)
```

## Tips for Success

1. **Start your day by reviewing the board**
2. **Never exceed 2 items in In Progress**
3. **Move cards immediately when status changes**
4. **Write clear acceptance criteria in Ready**
5. **Celebrate when moving to Done!** 🎉
