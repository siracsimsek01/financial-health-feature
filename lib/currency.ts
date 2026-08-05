const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

export function formatPounds(amount: number): string {
  return gbp.format(amount);
}

// "2026-03" -> "March 2026" (or "Mar" in short form, for chart axes)
export function formatPeriod(
  period: string,
  form: "long" | "short" = "long",
): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    month: form,
    ...(form === "long" ? { year: "numeric" } : {}),
  }).format(date);
}
