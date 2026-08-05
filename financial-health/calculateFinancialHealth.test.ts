import { describe, expect, it } from "vitest";
import { calculateFinancialHealth } from "./calculateFinancialHealth";
import type { FinancialStatement } from "./types";

function statement(income: number[], expenditure: number[]): FinancialStatement {
  return {
    id: "statement-test",
    period: "2026-03",
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

describe("calculateFinancialHealth", () => {
  it("reports a surplus with correct totals and expenditure ratio", () => {
    const result = calculateFinancialHealth(
      statement([2800, 300], [500, 100, 150, 500, 1000]),
    );

    expect(result).toEqual({
      status: "surplus",
      totalIncome: 3100,
      totalExpenditure: 2250,
      remainingIncome: 850,
      expenditureRatio: 2250 / 3100,
    });
  });

  it("reports a deficit with a negative remaining income and a ratio above 1", () => {
    const result = calculateFinancialHealth(statement([1000], [1500]));

    expect(result).toEqual({
      status: "deficit",
      totalIncome: 1000,
      totalExpenditure: 1500,
      remainingIncome: -500,
      expenditureRatio: 1.5,
    });
  });

  it("reports balanced when income and expenditure are exactly equal", () => {
    const result = calculateFinancialHealth(statement([2000], [1200, 800]));

    expect(result.status).toBe("balanced");
    expect(result.remainingIncome).toBe(0);
    expect(result.expenditureRatio).toBe(1);
  });

  it("reports balanced when sums are equal in pence despite floating-point noise", () => {
    // 0.1 + 0.2 !== 0.3 in floating point; pence arithmetic must absorb this
    const result = calculateFinancialHealth(statement([0.1, 0.2], [0.3]));

    expect(result.status).toBe("balanced");
    expect(result.remainingIncome).toBe(0);
  });

  it("treats a single penny of difference as surplus or deficit, never balanced", () => {
    const onePennyOver = calculateFinancialHealth(statement([1000.01], [1000]));
    const onePennyShort = calculateFinancialHealth(statement([1000], [1000.01]));

    expect(onePennyOver.status).toBe("surplus");
    expect(onePennyOver.remainingIncome).toBe(0.01);
    expect(onePennyShort.status).toBe("deficit");
    expect(onePennyShort.remainingIncome).toBe(-0.01);
  });

  it("reports no-income over deficit when income is zero, preserving the shortfall", () => {
    const result = calculateFinancialHealth(statement([], [300, 200]));

    expect(result).toEqual({
      status: "no-income",
      totalIncome: 0,
      totalExpenditure: 500,
      remainingIncome: -500,
      expenditureRatio: null,
    });
  });

  it("reports no-income with a null ratio when both income and expenditure are zero", () => {
    const result = calculateFinancialHealth(statement([], []));

    expect(result).toEqual({
      status: "no-income",
      totalIncome: 0,
      totalExpenditure: 0,
      remainingIncome: 0,
      expenditureRatio: null,
    });
  });

  it("treats an empty income list and income items summing to zero identically", () => {
    const emptyList = calculateFinancialHealth(statement([], [500]));
    const zeroItems = calculateFinancialHealth(statement([0, 0], [500]));

    expect(zeroItems).toEqual(emptyList);
    expect(zeroItems.status).toBe("no-income");
  });

  it("reports a surplus with a zero ratio when there is income but no expenditure", () => {
    const result = calculateFinancialHealth(statement([2500], []));

    expect(result).toEqual({
      status: "surplus",
      totalIncome: 2500,
      totalExpenditure: 0,
      remainingIncome: 2500,
      expenditureRatio: 0,
    });
  });
});
