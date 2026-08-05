import { describe, expect, it } from "vitest";
import { calculateFinancialTrend } from "./calculateFinancialTrend";
import type { FinancialStatement } from "./types";

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

describe("calculateFinancialTrend", () => {
  it("reports improving when the latest remaining income is higher", () => {
    const trend = calculateFinancialTrend([
      statement("2026-02", [3000], [2500]), // remaining 500
      statement("2026-03", [3000], [2200]), // remaining 800
    ]);

    expect(trend).toEqual({ direction: "improving", change: 300 });
  });

  it("reports worsening when the latest remaining income is lower", () => {
    const trend = calculateFinancialTrend([
      statement("2026-02", [3000], [2200]), // remaining 800
      statement("2026-03", [3000], [2500]), // remaining 500
    ]);

    expect(trend).toEqual({ direction: "worsening", change: -300 });
  });

  it("reports unchanged when remaining income is the same", () => {
    const trend = calculateFinancialTrend([
      statement("2026-02", [3000], [2500]),
      statement("2026-03", [2800], [2300]),
    ]);

    expect(trend).toEqual({ direction: "unchanged", change: 0 });
  });

  it("reports insufficient-data for a single statement", () => {
    const trend = calculateFinancialTrend([statement("2026-03", [3000], [2500])]);

    expect(trend).toEqual({ direction: "insufficient-data", change: null });
  });

  it("reports insufficient-data for no statements", () => {
    expect(calculateFinancialTrend([])).toEqual({
      direction: "insufficient-data",
      change: null,
    });
  });

  it("sorts by period rather than trusting input order", () => {
    const trend = calculateFinancialTrend([
      statement("2026-03", [3000], [2200]), // latest, remaining 800
      statement("2026-01", [3000], [2900]), // oldest, ignored
      statement("2026-02", [3000], [2500]), // previous, remaining 500
    ]);

    expect(trend).toEqual({ direction: "improving", change: 300 });
  });

  it("reports improving while still in deficit when the shortfall shrinks", () => {
    const trend = calculateFinancialTrend([
      statement("2026-02", [1000], [1300]), // remaining -300
      statement("2026-03", [1000], [1250]), // remaining -250
    ]);

    expect(trend).toEqual({ direction: "improving", change: 50 });
  });

  it("reports unchanged when floating-point noise would suggest a false change", () => {
    // both months have remaining income of exactly 0.30 in pence terms,
    // but naive float subtraction of (0.1 + 0.2) - 0.3 is non-zero
    const trend = calculateFinancialTrend([
      statement("2026-02", [0.1, 0.2], []),
      statement("2026-03", [0.3], []),
    ]);

    expect(trend).toEqual({ direction: "unchanged", change: 0 });
  });
});
