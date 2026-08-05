import { expect, test } from "@playwright/test";

// Lab measurement of Core Web Vitals per browser/device. LCP and CLS
// observers only exist in Chromium-based browsers; Firefox supports LCP but
// not CLS, and WebKit supports neither — those metrics are reported as
// unavailable there rather than failing the run. INP needs field data and is
// out of scope for a lab check.
type Vitals = {
  ttfb: number;
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
};

test("core web vitals are within thresholds", async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    const vitals: { lcp: number | null; cls: number | null } = {
      lcp: null,
      cls: null,
    };
    (window as unknown as { __vitals: typeof vitals }).__vitals = vitals;
    // observe() silently ignores unsupported types in some engines, so gate
    // on supportedEntryTypes to distinguish "measured 0" from "unmeasurable"
    const supported = PerformanceObserver.supportedEntryTypes ?? [];
    if (supported.includes("largest-contentful-paint")) {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) vitals.lcp = last.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    }
    if (supported.includes("layout-shift")) {
      vitals.cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as unknown as {
            hadRecentInput: boolean;
            value: number;
          };
          if (!shift.hadRecentInput) {
            vitals.cls = (vitals.cls ?? 0) + shift.value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    }
  });

  await page.goto("/");
  await page.locator(".recharts-wrapper").waitFor();
  // interact so LCP finalises, then let layout shifts settle
  await page.locator("button", { hasText: "August 2025" }).click();
  await page.waitForTimeout(1500);

  const vitals = await page.evaluate<Vitals>(() => {
    const nav = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    const fcp =
      performance
        .getEntriesByType("paint")
        .find((e) => e.name === "first-contentful-paint")?.startTime ?? null;
    const observed = (
      window as unknown as { __vitals: { lcp: number | null; cls: number | null } }
    ).__vitals;
    return {
      ttfb: nav.responseStart - nav.requestStart,
      fcp,
      lcp: observed.lcp,
      cls: observed.cls,
    };
  });

  await testInfo.attach("web-vitals", {
    body: JSON.stringify(vitals, null, 2),
    contentType: "application/json",
  });
  console.log(`[CWV] ${testInfo.project.name}:`, JSON.stringify(vitals));

  expect(vitals.ttfb).toBeLessThan(800);
  if (vitals.fcp !== null) expect(vitals.fcp).toBeLessThan(1800);
  if (vitals.lcp !== null) expect(vitals.lcp).toBeLessThan(2500);
  if (vitals.cls !== null) expect(vitals.cls).toBeLessThan(0.1);
});
