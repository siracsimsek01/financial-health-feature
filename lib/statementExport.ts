import {
  assessmentExplanation,
  disclaimerIntro,
  disclaimerSupport,
  statusLabels,
  trendSentence,
} from "@/financial-health/copy";
import type {
  FinancialHealthAssessment,
  FinancialItem,
  FinancialTrend,
} from "@/financial-health/types";
import { formatPounds } from "@/lib/currency";

// Structurally matches the dashboard's per-month view without importing from
// the React layer, keeping the export pipeline presentation-free.
export type StatementExportInput = {
  period: string;
  longLabel: string;
  assessment: FinancialHealthAssessment;
  income: FinancialItem[];
  expenditure: FinancialItem[];
  trend: FinancialTrend;
};

export type StatementExportData = {
  fileName: string;
  periodLabel: string;
  statusLabel: string;
  explanation: string;
  trendLine: string;
  totals: { income: string; outgoings: string; remaining: string };
  incomeItems: { label: string; amount: string }[];
  expenditureItems: { label: string; amount: string }[];
  disclaimer: string;
};

export function buildStatementExportData(
  month: StatementExportInput,
): StatementExportData {
  const toRow = (item: FinancialItem) => ({
    label: item.label,
    amount: formatPounds(item.amount),
  });

  return {
    fileName: `ophelos-statement-${month.period}.pdf`,
    periodLabel: month.longLabel,
    statusLabel: statusLabels[month.assessment.status],
    explanation: assessmentExplanation(month.assessment),
    trendLine: trendSentence(month.trend),
    totals: {
      income: formatPounds(month.assessment.totalIncome),
      outgoings: formatPounds(month.assessment.totalExpenditure),
      remaining: formatPounds(month.assessment.remainingIncome),
    },
    incomeItems: month.income.map(toRow),
    expenditureItems: month.expenditure.map(toRow),
    disclaimer: `${disclaimerIntro} ${disclaimerSupport}`,
  };
}
