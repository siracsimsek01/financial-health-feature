"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FinancialTrend } from "@/financial-health/types";
import { formatPounds } from "@/lib/currency";

export type HistoryPoint = {
  period: string;
  label: string;
  longLabel: string;
  totalIncome: number;
  totalExpenditure: number;
  remainingIncome: number;
};

type Props = {
  history: HistoryPoint[];
  trend: FinancialTrend;
};

function trendSentence(trend: FinancialTrend): string {
  switch (trend.direction) {
    case "improving":
      return `Your remaining income is ${formatPounds(trend.change)} higher than the previous month.`;
    case "worsening":
      return `Your remaining income is ${formatPounds(Math.abs(trend.change))} lower than the previous month.`;
    case "unchanged":
      return "Your remaining income is the same as the previous month.";
    case "insufficient-data":
      return "We need at least two months of information to show how things are changing.";
  }
}

const trendGlyphs: Record<FinancialTrend["direction"], string> = {
  improving: "↗",
  worsening: "↘",
  unchanged: "→",
  "insufficient-data": "",
};

function HistoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: HistoryPoint }>;
}) {
  if (!active || !payload?.length) {
    return null;
  }
  const point = payload[0].payload;
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3.5 text-sm shadow-lg shadow-zinc-900/5 dark:border-zinc-700 dark:bg-zinc-900">
      <p className="font-medium text-zinc-900 dark:text-zinc-50">
        {point.longLabel}
      </p>
      <dl className="mt-2 space-y-1 text-zinc-500 dark:text-zinc-400">
        <div className="flex justify-between gap-8">
          <dt>Income</dt>
          <dd className="tabular-nums">{formatPounds(point.totalIncome)}</dd>
        </div>
        <div className="flex justify-between gap-8">
          <dt>Outgoings</dt>
          <dd className="tabular-nums">
            {formatPounds(point.totalExpenditure)}
          </dd>
        </div>
        <div className="flex justify-between gap-8 border-t border-zinc-100 pt-1 font-medium text-zinc-900 dark:border-zinc-800 dark:text-zinc-50">
          <dt>Remaining</dt>
          <dd className="tabular-nums">{formatPounds(point.remainingIncome)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function FinancialHistoryChart({ history, trend }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-zinc-800 dark:text-zinc-200">
        {trendGlyphs[trend.direction] && (
          <span
            aria-hidden="true"
            className="mr-2 inline-flex size-6 items-center justify-center rounded-full bg-violet-50 text-sm text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
          >
            {trendGlyphs[trend.direction]}
          </span>
        )}
        {trendSentence(trend)}
      </p>
      <div
        className="mt-6 h-64"
        role="img"
        aria-label="Area chart of remaining income by month"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            accessibilityLayer
            data={history}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
          >
            <defs>
              <linearGradient id="remainingFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#71717a"
              strokeOpacity={0.12}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              stroke="#71717a"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis
              stroke="#71717a"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: number) => formatPounds(value)}
              width={70}
            />
            <Tooltip content={<HistoryTooltip />} cursor={{ stroke: "#8b5cf6", strokeOpacity: 0.25 }} />
            <Area
              type="monotone"
              dataKey="remainingIncome"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#remainingFill)"
              dot={{ r: 3, fill: "#8b5cf6", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
