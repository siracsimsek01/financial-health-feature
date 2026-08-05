import type { FinancialItem } from "@/financial-health/types";
import { formatPounds } from "@/lib/currency";

type Props = {
  income: FinancialItem[];
  expenditure: FinancialItem[];
  totalExpenditure: number;
};

function ItemList({
  title,
  items,
  proportionOf,
}: {
  title: string;
  items: FinancialItem[];
  // when set, each row shows a subtle bar of item.amount relative to this total
  proportionOf?: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Nothing recorded this month.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
          {items.map((item) => (
            <li key={item.id} className="py-2.5">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-zinc-700 dark:text-zinc-300">
                  {item.label}
                </span>
                <span className="font-medium tabular-nums text-zinc-900 dark:text-zinc-50">
                  {formatPounds(item.amount)}
                </span>
              </div>
              {proportionOf !== undefined && proportionOf > 0 && (
                <div
                  aria-hidden="true"
                  className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
                >
                  <div
                    className="h-full rounded-full bg-violet-300 transition-[width] duration-300 dark:bg-violet-700"
                    style={{
                      width: `${Math.min(100, (item.amount / proportionOf) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FinancialBreakdown({ income, expenditure, totalExpenditure }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
      <ItemList title="Income" items={income} />
      <ItemList
        title="Regular outgoings"
        items={expenditure}
        proportionOf={totalExpenditure}
      />
    </div>
  );
}
