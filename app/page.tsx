import { Dashboard, type MonthView } from "@/components/Dashboard";
import { type HistoryPoint } from "@/components/FinancialHistoryChart";
import { mockStatements } from "@/data/mockStatements";
import { calculateFinancialHealth } from "@/financial-health/calculateFinancialHealth";
import { calculateFinancialTrend } from "@/financial-health/calculateFinancialTrend";
import { formatPeriod } from "@/lib/currency";

export default function Home() {
  const byPeriod = [...mockStatements].sort((a, b) =>
    a.period.localeCompare(b.period),
  );

  if (byPeriod.length === 0) {
    return (
      <main className="flex-1 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your financial overview
        </h1>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          There is no financial information recorded for you yet.
        </p>
      </main>
    );
  }

  const months: MonthView[] = byPeriod.map((statement) => ({
    period: statement.period,
    longLabel: formatPeriod(statement.period),
    assessment: calculateFinancialHealth(statement),
    income: statement.income,
    expenditure: statement.expenditure,
  }));

  const trend = calculateFinancialTrend(byPeriod);

  const history: HistoryPoint[] = months.map((month) => ({
    period: month.period,
    label: formatPeriod(month.period, "short"),
    longLabel: month.longLabel,
    totalIncome: month.assessment.totalIncome,
    totalExpenditure: month.assessment.totalExpenditure,
    remainingIncome: month.assessment.remainingIncome,
  }));

  return (
    <main className="flex-1">
      <Dashboard months={months} history={history} trend={trend} />
    </main>
  );
}
