# Project context

This project is a take home implementation of a customer financial
health feature for Ophelos.

Customers already provide income and regular expenditure. This
application helps them understand their current financial position
and how it changes over time.

Some customers may be experiencing financial difficulty, so
correctness, explainability, accessibility and appropriate language
matter more than visual complexity.

## Architecture

Source financial data is represented as monthly FinancialStatement
snapshots.

Financial calculations live in `financial-health/`.

React components consume calculated domain results. they should not
reimplement affordability or trend calculations.

Presentation formatting belongs outside the financial domain.

## Domain principles

Keep financial calculations pure and deterministic.

Prefer derived values over duplicated stored state.

Do not introduce arbitrary financial-health scores or thresholds
without discussing and justifying them first.

Zero income scenarios must be handled explicitly. NaN and Infinity
must never reach the customer interface.

Avoid introducing financial assumptions that cannot be explained
from the available source data.

## React principles

Prefer derived values over React state.

Avoid unnecessary useEffect, useMemo and useCallback.

Do not introduce global state or state-management libraries unless
there is a clear need.

Keep components focused, but do not split components solely for the
sake of abstraction.

## Testing

Tests should protect meaningful financial behaviour rather than
optimise for coverage percentage.

Important cases include:

- positive remaining income
- expenditure equal to income
- expenditure greater than income
- zero income
- zero expenditure
- empty financial statements
- insufficient historical data
- historical ordering
- improving, worsening and unchanged positions

Prefer behavioural tests over implementation-detail tests.

## Customer experience

Use factual, calm and non-judgemental language.

Do not describe customers themselves as financially good, bad,
healthy or unhealthy.

Do not imply that the application provides financial advice.

Financial state must not be communicated using colour alone.

Where the application reaches a conclusion, the underlying numbers
should make that conclusion understandable.

## Scope

This is a take home project.

Prefer a small, complete implementation over production-style
abstraction layers.

Do not introduce libraries, services or abstractions unless they
solve a concrete problem.

When requirements are ambiguous, surface the assumption rather than
silently making a product decision.

When reviewing code, suggest removing unnecessary complexity as
readily as adding new code.

Before broad multi-file changes, explain the proposed change first.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
