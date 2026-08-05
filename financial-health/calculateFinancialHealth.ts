import type {
  FinancialHealthAssessment,
  FinancialItem,
  FinancialStatement,
} from "./types";

// Amounts are pounds with at most two decimal places (validated upstream),
// so rounding each item to integer pence is exact and keeps all
// state-affecting arithmetic free of floating-point noise.
function sumInPence(items: FinancialItem[]): number {
  return items.reduce((total, item) => total + Math.round(item.amount * 100), 0);
}

export function calculateFinancialHealth(
  statement: FinancialStatement,
): FinancialHealthAssessment {
  const incomePence = sumInPence(statement.income);
  const expenditurePence = sumInPence(statement.expenditure);
  const remainingPence = incomePence - expenditurePence;

  const totalExpenditure = expenditurePence / 100;
  const remainingIncome = remainingPence / 100;

  if (incomePence === 0) {
    return {
      status: "no-income",
      totalIncome: 0,
      totalExpenditure,
      remainingIncome,
      expenditureRatio: null,
    };
  }

  const status =
    remainingPence === 0 ? "balanced" : remainingPence > 0 ? "surplus" : "deficit";

  return {
    status,
    totalIncome: incomePence / 100,
    totalExpenditure,
    remainingIncome,
    expenditureRatio: expenditurePence / incomePence,
  };
}
