import type { FinancialStatement } from "@/financial-health/types";

export const mockStatements: FinancialStatement[] = [
  {
    id: "statement-2026-03",
    period: "2026-03",
    income: [
      {
        id: "salary",
        label: "Salary",
        amount: 2800,
      },
      {
        id: "other-income",
        label: "Other",
        amount: 300,
      },
    ],
    expenditure: [
      {
        id: "mortgage",
        label: "Mortgage",
        amount: 500,
      },
      {
        id: "utilities",
        label: "Utilities",
        amount: 100,
      },
      {
        id: "travel",
        label: "Travel",
        amount: 150,
      },
      {
        id: "food",
        label: "Food",
        amount: 500,
      },
      {
        id: "loan",
        label: "Loan repayment",
        amount: 1000,
      },
    ],
  },

  // additional months...
];