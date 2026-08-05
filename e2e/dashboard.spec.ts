import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator(".recharts-wrapper").waitFor();
  // let hydration attach handlers before interacting
  await page.waitForTimeout(300);
});

test("shows the latest month by default", async ({ page }) => {
  await expect(
    page.getByText("Remaining this month", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("£850.00").first()).toBeVisible();
  await expect(page.locator('[role="status"]')).toHaveCount(0);
  await expect(page.locator('button[aria-pressed="true"]')).toContainText(
    "March 2026",
  );
});

test("selecting a month updates summary, assessment and breakdown together", async ({
  page,
}) => {
  await page.locator("button", { hasText: "February 2026" }).click();

  await expect(page.locator('[role="status"]')).toContainText(
    "Viewing February 2026",
  );
  await expect(page.getByText("Remaining in February 2026")).toBeVisible();
  await expect(page.getByText("£730.00").first()).toBeVisible();
  await expect(page.getByText("76% of your income")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "February 2026 in detail" }),
  ).toBeVisible();
});

test("balanced month shows the breaking-even status", async ({ page }) => {
  await page.locator("button", { hasText: "September 2025" }).click();

  await expect(page.getByText("Breaking even")).toBeVisible();
  await expect(page.getByText("£0.00").first()).toBeVisible();
});

test("deficit month shows calm non-judgemental status with ratio above 100%", async ({
  page,
}) => {
  await page.locator("button", { hasText: "August 2025" }).click();

  await expect(page.getByText("Spending more than income")).toBeVisible();
  await expect(page.getByText("-£330.00").first()).toBeVisible();
  await expect(page.getByText("118% of your income")).toBeVisible();
  await expect(page.getByText("Universal Credit")).toBeVisible();
});

test("back to latest restores the current month", async ({ page }) => {
  await page.locator("button", { hasText: "August 2025" }).click();
  await page.getByRole("button", { name: "Back to latest" }).click();

  await expect(page.locator('[role="status"]')).toHaveCount(0);
  await expect(
    page.getByText("Remaining this month", { exact: true }),
  ).toBeVisible();
  await expect(page.locator('button[aria-pressed="true"]')).toContainText(
    "March 2026",
  );
});

test("clicking the chart surface selects a month without a visible focus ring", async ({
  page,
  hasTouch,
}) => {
  const surface = page.locator("svg.recharts-surface");
  // raw mouse/touch coordinates don't auto-scroll to the element, and on
  // phone viewports the chart sits below the fold
  await surface.scrollIntoViewIfNeeded();
  const box = await surface.boundingBox();
  if (!box) throw new Error("chart surface not rendered");
  // click/tap inside the plot, left half -> selects an earlier month
  const x = box.x + box.width * 0.3;
  const y = box.y + box.height * 0.5;
  if (hasTouch) {
    // touch devices set the active point via touchstart, not mousemove
    await page.touchscreen.tap(x, y);
  } else {
    await page.mouse.click(x, y);
  }

  await expect(page.locator('[role="status"]')).toBeVisible();
  const outlined = await page.evaluate(() =>
    [
      ...document.querySelectorAll(".recharts-wrapper, .recharts-wrapper *"),
    ].some(
      (n) =>
        n.matches(":focus") && getComputedStyle(n).outlineStyle !== "none",
    ),
  );
  expect(outlined).toBe(false);
});

test("expenditure rows render proportional bars", async ({ page }) => {
  const bars = page.locator('[aria-hidden="true"].h-1');
  await expect(bars).toHaveCount(5);
});

test("how-is-this-calculated disclosure opens and explains the calculation", async ({
  page,
}) => {
  await page.getByText("How is this calculated?").click();
  await expect(
    page.getByText("recorded income minus your recorded regular outgoings"),
  ).toBeVisible();
});

test("month pills are keyboard operable", async ({ page, isMobile }) => {
  test.skip(isMobile, "keyboard interaction is a desktop concern");

  await page.locator("button", { hasText: "June 2025" }).focus();
  await page.keyboard.press("Enter");

  await expect(page.locator('[role="status"]')).toContainText(
    "Viewing June 2025",
  );
});

test("desktop layout fits in one screen without scrolling", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "mobile intentionally stacks and scrolls");

  const fits = await page.evaluate(
    () => document.documentElement.scrollHeight <= window.innerHeight,
  );
  expect(fits).toBe(true);
});

test("exports the currently selected month as a PDF", async ({ page }) => {
  await page.locator("button", { hasText: "August 2025" }).click();
  await expect(page.locator('[role="status"]')).toContainText(
    "Viewing August 2025",
  );

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export PDF" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("ophelos-statement-2025-08.pdf");
});

test("exports the latest month by default", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export PDF" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("ophelos-statement-2026-03.pdf");
});

test("mobile layout has no horizontal overflow", async ({ page }) => {
  const noSideScroll = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth,
  );
  expect(noSideScroll).toBe(true);
});
