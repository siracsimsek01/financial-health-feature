"use client";

import Image from "next/image";
import { useState } from "react";
import { AffordabilityAssessment } from "@/components/AffordabilityAssessment";
import { Disclaimer } from "@/components/Disclaimer";
import { FinancialBreakdown } from "@/components/FinancialBreakdown";
import {
  FinancialHistoryChart,
  type HistoryPoint,
} from "@/components/FinancialHistoryChart";
import { FinancialSummary } from "@/components/FinancialSummary";
import type {
  FinancialHealthAssessment,
  FinancialItem,
  FinancialTrend,
} from "@/financial-health/types";

export type MonthView = {
  period: string;
  longLabel: string;
  assessment: FinancialHealthAssessment;
  income: FinancialItem[];
  expenditure: FinancialItem[];
};

type Props = {
  months: MonthView[]; // sorted by period, oldest first
  history: HistoryPoint[];
  trend: FinancialTrend;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
      {children}
    </h2>
  );
}

export function Dashboard({ months, history, trend }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);

  const latest = months[months.length - 1];
  const selected =
    (selectedPeriod && months.find((m) => m.period === selectedPeriod)) ||
    latest;
  const viewingLatest = selected.period === latest.period;

  return (
    <div className="flex min-h-screen flex-col gap-4 px-4 py-4 sm:px-6 lg:h-screen lg:overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Ophelos"
            width={44}
            height={44}
            priority
            className="rounded-xl"
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your financial overview
            </h1>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Based on your recorded income and outgoings up to{" "}
              {latest.longLabel}.
            </p>
          </div>
        </div>
        {!viewingLatest && (
          <div
            role="status"
            className="flex items-center gap-3 rounded-full border border-violet-200 bg-violet-50 py-1.5 pl-4 pr-1.5 text-sm text-violet-900 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-200"
          >
            <p>
              Viewing{" "}
              <span className="font-semibold">{selected.longLabel}</span>
            </p>
            <button
              type="button"
              onClick={() => setSelectedPeriod(null)}
              className="cursor-pointer rounded-full bg-white px-3 py-1 font-medium text-violet-800 shadow-sm ring-1 ring-violet-200 transition-colors hover:bg-violet-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:bg-zinc-900 dark:text-violet-300 dark:ring-violet-900 dark:hover:bg-zinc-800"
            >
              Back to latest
            </button>
          </div>
        )}
      </header>

      <section aria-label="Selected month at a glance">
        <FinancialSummary
          assessment={selected.assessment}
          title={
            viewingLatest
              ? "Remaining this month"
              : `Remaining in ${selected.longLabel}`
          }
        />
      </section>

      <div className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-12">
        <section
          aria-label="Affordability assessment"
          className="lg:col-span-3 lg:flex lg:min-h-0 lg:flex-col"
        >
          <SectionLabel>Where you stand</SectionLabel>
          <AffordabilityAssessment assessment={selected.assessment} />
        </section>

        <section
          aria-label="History"
          className="lg:col-span-6 lg:flex lg:min-h-0 lg:flex-col"
        >
          <SectionLabel>Over time</SectionLabel>
          <FinancialHistoryChart
            history={history}
            trend={trend}
            selectedPeriod={selected.period}
            onSelect={(period) =>
              setSelectedPeriod(period === latest.period ? null : period)
            }
          />
        </section>

        <section
          aria-label="Selected month in detail"
          className="lg:col-span-3 lg:flex lg:min-h-0 lg:flex-col"
        >
          <SectionLabel>{selected.longLabel} in detail</SectionLabel>
          <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <FinancialBreakdown
              income={selected.income}
              expenditure={selected.expenditure}
              totalExpenditure={selected.assessment.totalExpenditure}
            />
          </div>
        </section>
      </div>

      <Disclaimer />
    </div>
  );
}
