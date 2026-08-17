import { randomUUID } from "node:crypto";

import { expect, test as base } from "@playwright/test";

import {
  buildPresetSteps,
  createCardBalanceScenarioClient,
  withCardBalanceScenario,
} from "../../src/e2e/card-balance-scenario.mjs";

const CONTROLLED_API_BASE = "http://127.0.0.1:19181/api/backend";

export const test = base.extend({
  balanceScenarioSteps: [
    buildPresetSteps("steady-success", { balance: 100_000 }),
    { option: true },
  ],

  scenarioClient: async ({ playwright: _playwright }, provide) => {
    await provide(createCardBalanceScenarioClient({
      apiBase: process.env.E2E_API_BASE_URL ?? CONTROLLED_API_BASE,
    }));
  },

  cardBalanceScenario: async ({ scenarioClient, balanceScenarioSteps }, provide) => {
    await withCardBalanceScenario({
      client: scenarioClient,
      accountId: randomUUID(),
      steps: balanceScenarioSteps,
    }, provide);
  },
});

export { expect };
