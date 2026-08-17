import { randomUUID } from "node:crypto";

import { buildPresetSteps } from "../../src/e2e/card-balance-scenario.mjs";
import { expect, test } from "./fixtures.mjs";

test.describe.configure({ mode: "parallel" });

test("a worker fixture stores its ordered scenario on a unique account", async ({
  cardBalanceScenario,
}) => {
  await expect(
    cardBalanceScenario.client.get(cardBalanceScenario.accountId),
  ).resolves.toEqual({
    cardBalanceAccountId: cardBalanceScenario.accountId,
    steps: [{ type: "SUCCESS", balance: 100_000 }],
  });
});

test("another parallel fixture receives a separate account-local scenario", async ({
  cardBalanceScenario,
}) => {
  const response = await cardBalanceScenario.client.get(
    cardBalanceScenario.accountId,
  );

  expect(response.cardBalanceAccountId).toBe(cardBalanceScenario.accountId);
  expect(response.steps).toEqual([{ type: "SUCCESS", balance: 100_000 }]);
});

test("concurrent accounts remain isolated when one account is cleared", async ({
  scenarioClient,
}) => {
  const firstAccountId = randomUUID();
  const secondAccountId = randomUUID();
  const firstSteps = buildPresetSteps("failure-then-recovery", { balance: 125_000 });
  const secondSteps = buildPresetSteps("decrease", {
    fromBalance: 200_000,
    toBalance: 150_000,
  });

  try {
    await Promise.all([
      scenarioClient.replace(firstAccountId, firstSteps),
      scenarioClient.replace(secondAccountId, secondSteps),
    ]);
    await scenarioClient.clear(firstAccountId);

    await expect(scenarioClient.get(firstAccountId)).resolves.toEqual({
      cardBalanceAccountId: firstAccountId,
      steps: [],
    });
    await expect(scenarioClient.get(secondAccountId)).resolves.toEqual({
      cardBalanceAccountId: secondAccountId,
      steps: secondSteps,
    });
  } finally {
    await Promise.all([
      scenarioClient.clear(firstAccountId),
      scenarioClient.clear(secondAccountId),
    ]);
  }
});
