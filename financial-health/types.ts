export type FinancialItem = {
  id: string;
  label: string;
  amount: number;
};

export type FinancialStatement = {
  id: string;
  period: string;
  income: FinancialItem[];
  expenditure: FinancialItem[];
};

type BaseAssessment = {
  totalIncome: number;
  totalExpenditure: number;
  remainingIncome: number;
};

export type FinancialHealthAssessment =
  | (BaseAssessment & {
      status: "no-income";
      totalIncome: 0;
      expenditureRatio: null;
    })
  | (BaseAssessment & {
      status: "surplus" | "balanced" | "deficit";
      expenditureRatio: number;
    });

export type FinancialTrend =
  | {
      direction: "insufficient-data";
      change: null;
    }
  | {
      direction: "improving" | "worsening" | "unchanged";
      change: number;
    };