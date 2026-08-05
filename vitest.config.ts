import { defineConfig } from "vitest/config";

// Keep vitest scoped to the domain unit tests; e2e specs live in /e2e and
// run under Playwright, which has an incompatible test runner API.
export default defineConfig({
  test: {
    include: ["financial-health/**/*.test.ts", "lib/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname,
    },
  },
});
