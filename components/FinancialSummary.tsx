import type { FinancialHealthAssessment } from "@/financial-health/types";
import { formatPounds } from "@/lib/currency";

type Props = {
  assessment: FinancialHealthAssessment;
  title?: string;
};

export function FinancialSummary({
  assessment,
  title = "Remaining this month",
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-50">
            {formatPounds(assessment.remainingIncome)}
          </p>
        </div>
        <dl className="flex gap-8 sm:gap-10">
          <div>
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">Income</dt>
            <dd className="mt-1 text-xl font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatPounds(assessment.totalIncome)}
            </dd>
          </div>
          <div className="border-l border-zinc-200 pl-8 sm:pl-10 dark:border-zinc-800">
            <dt className="text-sm text-zinc-500 dark:text-zinc-400">
              Outgoings
            </dt>
            <dd className="mt-1 text-xl font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
              {formatPounds(assessment.totalExpenditure)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
