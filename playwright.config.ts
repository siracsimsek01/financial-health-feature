import { defineConfig, devices } from "@playwright/test";

// E2e tests run against a production build: `pnpm build` first, then
// the webServer below serves it with `next start`.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm start --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "Desktop Firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "Desktop Safari", use: { ...devices["Desktop Safari"] } },
    { name: "iPhone 15", use: { ...devices["iPhone 15"] } },
    { name: "Pixel 7", use: { ...devices["Pixel 7"] } },
    { name: "iPad Pro 11", use: { ...devices["iPad Pro 11"] } },
  ],
});
