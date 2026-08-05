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


export type AffordabilityStatus = 
| "surplus"
| "balanced"
| "deficit"
| "no-income"

export type FinancialHealthAssesment = {
    totalIncome: number;
    totalExpenditure: number;
    remainingIncome: number;
    expenditureRatio: number | null;
    status: AffordabilityStatus;
}

export type TrendDirection =
  | "improving"
  | "worsening"
  | "unchanged"
  | "insufficient-data";

export type FinancialTrend = {
  direction: TrendDirection;
  change: number | null;
};