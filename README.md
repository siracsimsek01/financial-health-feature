# Ophelos Financial Health

A small Next.js application that helps customers understand their
current financial position and how it has changed over time.

## What it does

- calculates an explainable affordability assessment
- shows income, regular outgoings and remaining income
- tracks remaining income over time
- allows customers to explore previous monthly statements
- handles deficit, balanced and zero-income states
- explains how the affordability result was calculated

## Tech

- Next.js
- TypeScript
- React
- Tailwind CSS
- Recharts
- Vitest

## Running locally

pnpm install
pnpm dev

Open http://localhost:3000

## Tests

pnpm test

The test suite focuses on financial behaviour and edge cases including
zero income, deficits, floating-point precision and historical trend
calculations.

## Validation

pnpm test
pnpm tsc --noEmit
pnpm build

## Project structure

financial-health/   Pure financial domain logic and tests
components/         Presentation and interactive UI
data/               Representative financial statements
lib/                Display formatting utilities

## Decisions

See [DECISIONS.md](./DECISIONS.md) for product and engineering
trade-offs.

## AI usage

Claude Code was used throughout the task for design review,
implementation, testing and code review.

The full prompt history is included with the submission.
