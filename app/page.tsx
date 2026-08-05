import { AffordabilityAssessment } from "@/components/AffordabilityAssessment";
import { Disclaimer } from "@/components/Disclaimer";
import { FinancialBreakdown } from "@/components/FinancialBreakdown";
import {
  FinancialHistoryChart,
  type HistoryPoint,
} from "@/components/FinancialHistoryChart";
import { FinancialSummary } from "@/components/FinancialSummary";
import { mockStatements } from "@/data/mockStatements";
import { calculateFinancialHealth } from "@/financial-health/calculateFinancialHealth";
import { calculateFinancialTrend } from "@/financial-health/calculateFinancialTrend";
import { formatPeriod } from "@/lib/currency";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
      {children}
    </h2>
  );
}

export default function Home() {
  const byPeriod = [...mockStatements].sort((a, b) =>
    a.period.localeCompare(b.period),
  );

  if (byPeriod.length === 0) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          Your financial overview
        </h1>
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          There is no financial information recorded for you yet.
        </p>
      </main>
    );
  }

  const current = byPeriod[byPeriod.length - 1];
  const assessment = calculateFinancialHealth(current);
  const trend = calculateFinancialTrend(byPeriod);

  const history: HistoryPoint[] = byPeriod.map((statement) => {
    const { totalIncome, totalExpenditure, remainingIncome } =
      calculateFinancialHealth(statement);
    return {
      period: statement.period,
      label: formatPeriod(statement.period, "short"),
      longLabel: formatPeriod(statement.period),
      totalIncome,
      totalExpenditure,
      remainingIncome,
    };
  });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your financial overview
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Based on your recorded income and outgoings for{" "}
          {formatPeriod(current.period)}.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <section aria-label="This month at a glance">
          <SectionLabel>At a glance</SectionLabel>
          <FinancialSummary assessment={assessment} />
        </section>

        <section aria-label="Affordability assessment">
          <SectionLabel>Where you stand</SectionLabel>
          <AffordabilityAssessment assessment={assessment} />
        </section>

        <section aria-label="History">
          <SectionLabel>Over time</SectionLabel>
          <FinancialHistoryChart history={history} trend={trend} />
        </section>

        <section aria-label="This month in detail">
          <SectionLabel>{formatPeriod(current.period)} in detail</SectionLabel>
          <FinancialBreakdown
            income={current.income}
            expenditure={current.expenditure}
          />
        </section>

        <Disclaimer />
      </div>
    </main>
  );
}
