import type { FinancialStatement } from "@/financial-health/types";

export const mockStatements: FinancialStatement[] = [
  {
    id: "statement-2025-12",
    period: "2025-12",
    income: [
      {
        id: "salary",
        label: "Salary",
        amount: 2800,
      },
      {
        id: "other-income",
        label: "Other",
        amount: 150,
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
        amount: 120,
      },
      {
        id: "travel",
        label: "Travel",
        amount: 160,
      },
      {
        id: "food",
        label: "Food",
        amount: 550,
      },
      {
        id: "loan",
        label: "Loan repayment",
        amount: 1000,
      },
    ],
  },
  {
    id: "statement-2026-01",
    period: "2026-01",
    income: [
      {
        id: "salary",
        label: "Salary",
        amount: 2800,
      },
      {
        id: "other-income",
        label: "Other",
        amount: 100,
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
        amount: 140,
      },
      {
        id: "travel",
        label: "Travel",
        amount: 150,
      },
      {
        id: "food",
        label: "Food",
        amount: 560,
      },
      {
        id: "loan",
        label: "Loan repayment",
        amount: 1000,
      },
    ],
  },
  {
    id: "statement-2026-02",
    period: "2026-02",
    income: [
      {
        id: "salary",
        label: "Salary",
        amount: 2800,
      },
      {
        id: "other-income",
        label: "Other",
        amount: 200,
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
        amount: 110,
      },
      {
        id: "travel",
        label: "Travel",
        amount: 140,
      },
      {
        id: "food",
        label: "Food",
        amount: 520,
      },
      {
        id: "loan",
        label: "Loan repayment",
        amount: 1000,
      },
    ],
  },
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
];
