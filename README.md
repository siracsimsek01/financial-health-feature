# Ophelos Financial Health Dashboard

A Next.js and TypeScript application that helps customers understand their current financial position and how it changes over time.

The feature turns existing income and expenditure data into an explainable affordability assessment, historical trend view, detailed monthly breakdown, and branded PDF export.

## What it does

- Calculates total income, total expenditure, and remaining income
- Provides an explainable affordability assessment
- Handles surplus, balanced, deficit, and no-income states
- Shows expenditure as a proportion of income
- Tracks financial position across monthly statements
- Allows customers to explore previous months
- Updates the summary, assessment, trend, and breakdown together
- Shows whether a selected month improved or worsened compared with the previous available month
- Explains how the affordability result was calculated
- Exports the selected monthly statement as a branded PDF
- Supports keyboard navigation and responsive layouts

## Product approach

The application focuses on three customer questions:

1. Where do I stand financially now?
2. Why am I seeing this result?
3. Is my position improving or getting worse over time?

I deliberately avoided creating an arbitrary financial-health score.

Instead, the dashboard shows the actual income, outgoings, remaining income, and expenditure ratio behind the result. This keeps the assessment deterministic, testable, and easy to explain.

The language is factual and non-judgemental, and the result is presented as information rather than financial advice.

More detail is available in [DECISIONS.md](./DECISIONS.md).

## Tech stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- jsPDF
- Vitest
- React Testing Library
- Playwright

## Running locally

### Requirements

- Node.js 20 or later
- pnpm

### Install dependencies

```bash
pnpm install