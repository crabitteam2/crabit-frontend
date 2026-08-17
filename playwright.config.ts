import { defineConfig } from "@playwright/test";

const controlledServerPort = 19_181;
const externalApiBase = process.env.E2E_API_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  testMatch: "**/*.spec.mjs",
  fullyParallel: true,
  workers: 2,
  timeout: 10_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  webServer: externalApiBase
    ? undefined
    : {
        command: "node tests/e2e/support/scenario-server.mjs",
        url: `http://127.0.0.1:${controlledServerPort}/health`,
        reuseExistingServer: false,
        timeout: 10_000,
      },
  use: {
    trace: "retain-on-failure",
  },
});
