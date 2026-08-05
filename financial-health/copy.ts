import { formatPounds } from "@/lib/currency";
import type { FinancialHealthAssessment, FinancialTrend } from "./types";

// Customer-facing wording shared by the dashboard components and the PDF
// export, so the two can never drift apart.

export const statusLabels: Record<FinancialHealthAssessment["status"], string> =
  {
    surplus: "Money left over",
    balanced: "Breaking even",
    deficit: "Spending more than income",
    "no-income": "No income recorded",
  };

export function assessmentExplanation(
  assessment: FinancialHealthAssessment,
): string {
  const income = formatPounds(assessment.totalIncome);
  const outgoings = formatPounds(assessment.totalExpenditure);

  switch (assessment.status) {
    case "surplus":
      return `Your income of ${income} covers your regular outgoings of ${outgoings}, leaving ${formatPounds(assessment.remainingIncome)} this month.`;
    case "balanced":
      return `Your income of ${income} exactly matches your regular outgoings, so there is nothing left over this month.`;
    case "deficit":
      return `Your regular outgoings of ${outgoings} are ${formatPounds(Math.abs(assessment.remainingIncome))} more than your income of ${income} this month.`;
    case "no-income":
      return assessment.totalExpenditure > 0
        ? `No income is recorded for this month, while your regular outgoings come to ${outgoings}.`
        : "No income or outgoings are recorded for this month.";
  }
}

export function trendSentence(trend: FinancialTrend): string {
  switch (trend.direction) {
    case "improving":
      return `Your remaining income is ${formatPounds(trend.change)} higher than the previous month.`;
    case "worsening":
      return `Your remaining income is ${formatPounds(Math.abs(trend.change))} lower than the previous month.`;
    case "unchanged":
      return "Your remaining income is the same as the previous month.";
    case "insufficient-data":
      return "We need at least two months of information to show how things are changing.";
  }
}

export const disclaimerIntro =
  "This overview is based on the income and spending information recorded for you, and is here to help you understand your position. It is not financial advice.";

export const disclaimerSupport =
  "If money is feeling difficult right now, free and independent support is available from MoneyHelper (moneyhelper.org.uk) and StepChange (stepchange.org).";
