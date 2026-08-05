import { calculateFinancialHealth } from "./calculateFinancialHealth";
import type { FinancialStatement, FinancialTrend } from "./types";

// remainingIncome comes from pence-exact arithmetic, so this round-trip
// back to integer pence is lossless.
function remainingIncomeInPence(statement: FinancialStatement): number {
  return Math.round(calculateFinancialHealth(statement).remainingIncome * 100);
}

export function calculateFinancialTrend(
  statements: FinancialStatement[],
): FinancialTrend {
  if (statements.length < 2) {
    return { direction: "insufficient-data", change: null };
  }

  const byPeriod = [...statements].sort((a, b) =>
    a.period.localeCompare(b.period),
  );
  const [previous, latest] = byPeriod.slice(-2);

  const changePence =
    remainingIncomeInPence(latest) - remainingIncomeInPence(previous);

  const direction =
    changePence === 0 ? "unchanged" : changePence > 0 ? "improving" : "worsening";

  return { direction, change: changePence / 100 };
}
