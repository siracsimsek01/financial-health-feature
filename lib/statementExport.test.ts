import { describe, expect, it } from "vitest";
import { calculateFinancialHealth } from "@/financial-health/calculateFinancialHealth";
import { calculateFinancialTrend } from "@/financial-health/calculateFinancialTrend";
import type { FinancialStatement } from "@/financial-health/types";
import {
  buildStatementExportData,
  type StatementExportInput,
} from "./statementExport";

function statement(
  period: string,
  income: number[],
  expenditure: number[],
): FinancialStatement {
  return {
    id: `statement-${period}`,
    period,
    income: income.map((amount, index) => ({
      id: `income-${index}`,
      label: `Income ${index}`,
      amount,
    })),
    expenditure: expenditure.map((amount, index) => ({
      id: `expenditure-${index}`,
      label: `Expenditure ${index}`,
      amount,
    })),
  };
}

// Mirrors how the server page assembles a month view: domain functions are
// the only source of the derived figures.
function monthView(
  statements: FinancialStatement[],
  period: string,
  longLabel: string,
): StatementExportInput {
  const index = statements.findIndex((s) => s.period === period);
  const target = statements[index];
  return {
    period: target.period,
    longLabel,
    assessment: calculateFinancialHealth(target),
    income: target.income,
    expenditure: target.expenditure,
    trend: calculateFinancialTrend(statements.slice(0, index + 1)),
  };
}

const history: FinancialStatement[] = [
  statement("2026-01", [2900], [2350]), // remaining 550
  statement("2026-02", [3000], [2270]), // remaining 730
  statement("2026-03", [3100], [2250]), // remaining 850
];

describe("buildStatementExportData", () => {
  it("exports the selected month's figures, not the latest month's", () => {
    const data = buildStatementExportData(
      monthView(history, "2026-02", "February 2026"),
    );

    expect(data.fileName).toBe("ophelos-statement-2026-02.pdf");
    expect(data.periodLabel).toBe("February 2026");
    expect(data.totals).toEqual({
      income: "£3,000.00",
      outgoings: "£2,270.00",
      remaining: "£730.00",
    });
  });

  it("carries the selected month's trend against its previous month", () => {
    const february = buildStatementExportData(
      monthView(history, "2026-02", "February 2026"),
    );
    // Feb (730) vs Jan (550) -> +180, even though Mar exists after it
    expect(february.trendLine).toBe(
      "Your remaining income is £180.00 higher than the previous month.",
    );
  });

  it("reports insufficient history for the oldest month", () => {
    const january = buildStatementExportData(
      monthView(history, "2026-01", "January 2026"),
    );
    expect(january.trendLine).toContain("at least two months");
  });

  it("includes status, explanation, item rows and the disclaimer", () => {
    const data = buildStatementExportData(
      monthView(history, "2026-03", "March 2026"),
    );

    expect(data.statusLabel).toBe("Money left over");
    expect(data.explanation).toContain("£3,100.00");
    expect(data.explanation).toContain("£850.00");
    expect(data.incomeItems).toEqual([
      { label: "Income 0", amount: "£3,100.00" },
    ]);
    expect(data.expenditureItems).toEqual([
      { label: "Expenditure 0", amount: "£2,250.00" },
    ]);
    expect(data.disclaimer).toContain("not financial advice");
    expect(data.disclaimer).toContain("MoneyHelper");
  });

  it("exports a deficit month with negative remaining income intact", () => {
    const deficitHistory = [
      statement("2025-07", [1900], [2220]),
      statement("2025-08", [1800], [2130]),
    ];
    const data = buildStatementExportData(
      monthView(deficitHistory, "2025-08", "August 2025"),
    );

    expect(data.statusLabel).toBe("Spending more than income");
    expect(data.totals.remaining).toBe("-£330.00");
    // -330 vs -320 -> £10 lower
    expect(data.trendLine).toBe(
      "Your remaining income is £10.00 lower than the previous month.",
    );
  });
});
