# GitHub Project Board Configuration

This document defines the Kanban board structure for the Snakelle project.

## Board Setup Instructions

### Creating the GitHub Project Board

1. Navigate to the repository on GitHub: https://github.com/0xf1f0/snakelle
2. Click on the "Projects" tab
3. Click "New project" → "Board" template
4. Name the project: "Snakelle MVP Development"
5. Set the board as the default view for the repository

### Column Configuration

Configure the board with the following columns **in this exact order**:

#### 1. Backlog
- **Purpose**: All cards/issues that are not yet ready to work on
- **Description**: "Everything not yet ready to work"
- **Criteria**: 
  - Issues that need more research or definition
  - Ideas and feature requests
  - Low-priority items
  - Dependencies not yet resolved

#### 2. Ready
- **Purpose**: Issues that are well-defined, unblocked, and ready to be picked up next
- **Description**: "Well-defined, unblocked, next up"
- **Criteria**:
  - Acceptance criteria clearly defined
  - No blockers or dependencies
  - Fully specified and ready to implement
  - Prioritized and ready for work

#### 3. In Progress
- **Purpose**: Active work items
- **Description**: "Max 1–2 issues at a time (solo dev rule)"
- **Criteria**:
  - Currently being worked on
  - **LIMIT**: Maximum 1–2 issues (Solo Developer Rule)
  - Pull request may be open
  - Active development happening

**⚠️ Solo Developer Rule**: This column should contain **no more than 2 issues** at any time. This is a guardrail to prevent context-switching and maintain focus. If this column has more than 2 issues, it indicates the workflow is being violated.

#### 4. Review / Verify
- **Purpose**: For manual testing and acceptance criteria verification
- **Description**: "Manual testing, acceptance criteria check"
- **Criteria**:
  - Code review in progress
  - Testing against acceptance criteria
  - Manual verification needed
  - Waiting for feedback or approval

#### 5. Done
- **Purpose**: Completed and deployed work
- **Description**: "Meets AC, merged, deployed if applicable"
- **Criteria**:
  - Acceptance criteria met
  - Code merged to main branch
  - Deployed to production (if applicable)
  - No further action required

## Workflow Rules

### Moving Cards Between Columns

1. **Backlog → Ready**
   - Issue is fully defined with clear acceptance criteria
   - All dependencies are resolved or available
   - Issue is prioritized and ready to be worked

2. **Ready → In Progress**
   - Developer picks up the issue to work on
   - **Check**: Ensure no more than 2 issues are already in progress
   - Work begins (branch created, coding started)

3. **In Progress → Review / Verify**
   - Code changes are complete
   - Pull request opened
   - Ready for review and testing

4. **Review / Verify → In Progress**
   - Changes requested during review
   - Issues found during testing
   - Needs additional work

5. **Review / Verify → Done**
   - All acceptance criteria verified
   - Code reviewed and approved
   - Merged to main branch
   - Deployed (if applicable)

### Solo Developer WIP Limit

**The "In Progress" column must not contain more than 2 issues.**

This limit exists to:
- Reduce context-switching overhead
- Maintain focus on completing work
- Prevent work-in-progress buildup
- Ensure steady flow of completed work

**If the limit is exceeded:**
1. Stop picking up new work
2. Focus on completing existing in-progress items
3. Move items to "Review / Verify" as soon as possible
4. Only pick up new work when the count drops to 1 or 0

## Automation Recommendations

Consider setting up the following automations in GitHub Projects:

1. **Auto-add new issues to Backlog**
   - All new issues automatically appear in Backlog column

2. **WIP Limit Warning**
   - Visual indicator when "In Progress" has more than 2 items
   - GitHub Actions workflow to comment on issues (see `.github/workflows/wip-limit-check.yml`)

3. **Auto-close from Done**
   - Issues moved to Done are automatically closed

4. **PR linking**
   - Pull requests automatically linked to their issues

## Benefits of This Workflow

- **Clear visibility**: See the status of all work at a glance
- **Focus**: WIP limits prevent overcommitment
- **Flow**: Issues move smoothly through defined stages
- **Quality**: Review/Verify stage ensures all work is validated
- **Completion**: Clear definition of "done" prevents ambiguity

## Maintenance

Review the board weekly:
- Are items stuck in any column?
- Is the WIP limit being respected?
- Are "Ready" items properly defined?
- Should any Backlog items be promoted to Ready?
