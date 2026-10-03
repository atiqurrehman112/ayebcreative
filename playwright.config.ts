import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  timeout: 60_000,
  reporter: "list",
  outputDir: "artifacts/test-results",
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
