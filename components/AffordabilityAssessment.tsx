import {
  assessmentExplanation,
  statusLabels,
} from "@/financial-health/copy";
import type { FinancialHealthAssessment } from "@/financial-health/types";

type Props = {
  assessment: FinancialHealthAssessment;
};

type Status = FinancialHealthAssessment["status"];

// Muted tints, paired with the label text so state never relies on colour alone.
const statusChipClasses: Record<Status, string> = {
  surplus:
    "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  balanced: "bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  deficit: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  "no-income": "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};

const statusDotClasses: Record<Status, string> = {
  surplus: "bg-emerald-500",
  balanced: "bg-sky-500",
  deficit: "bg-amber-500",
  "no-income": "bg-zinc-400",
};

export function AffordabilityAssessment({ assessment }: Props) {
  return (
    <div className="h-full rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900">
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${statusChipClasses[assessment.status]}`}
      >
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${statusDotClasses[assessment.status]}`}
        />
        {statusLabels[assessment.status]}
      </span>
      <p className="mt-4 leading-relaxed text-zinc-800 dark:text-zinc-200">
        {assessmentExplanation(assessment)}
      </p>
      {assessment.expenditureRatio !== null ? (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          Your regular outgoings use{" "}
          {Math.round(assessment.expenditureRatio * 100)}% of your income.
        </p>
      ) : (
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
          We can&rsquo;t show an outgoings-to-income comparison this month
          because no income is recorded.
        </p>
      )}
      <details className="group mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <summary className="cursor-pointer list-none text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:text-zinc-400 dark:hover:text-zinc-200">
          <span aria-hidden="true" className="mr-1.5 inline-block transition-transform group-open:rotate-90">
            ›
          </span>
          How is this calculated?
        </summary>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          Remaining income is your recorded income minus your recorded regular
          outgoings for the month. This assessment is based only on the
          information provided here — it doesn&rsquo;t take into account
          anything that isn&rsquo;t recorded.
        </p>
      </details>
    </div>
  );
}
