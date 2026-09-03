import { expect, test } from "@playwright/test";

import {
  ACCOUNT_ID,
  startWishPhotoApplication,
  WISH_PHOTO_INPUT,
} from "./support/wish-photo-app.mjs";

test.describe("new Wish photo flow", () => {
  test.describe.configure({ mode: "serial", timeout: 60_000 });

  let application;

  test.beforeAll(async () => {
    application = await startWishPhotoApplication();
  });

  test.afterAll(async () => {
    await application?.close();
  });

  test.beforeEach(async ({ page }) => {
    application.reset();
    const persona = await page.request.post(
      `${application.url}/api/e2e/persona`,
      { data: { persona: "owner" } },
    );
    expect(persona.status()).toBe(204);
  });

  test("creates a Wish without a photo after preserving the account across routes", async ({
    page,
  }) => {
    await reachPhotoStep(page, application.url, "노트북", "150000");

    await page.getByRole("button", { name: "넘어가기" }).click();

    await expect(page.getByText("위시리스트가 생성되었어요!")).toBeVisible();
    expect(application.state.uploads).toHaveLength(0);
    expect(application.state.creations).toHaveLength(1);
    expect(application.state.creations[0]).toMatchObject({
      accountId: ACCOUNT_ID,
      authorization: "Bearer wish-photo-owner-token",
      body: {
        purpose: "노트북",
        targetAmount: 150_000,
        targetDate: null,
        photoId: null,
      },
    });
  });

  test("uploads a JPEG and creates a Wish with the returned photo", async ({
    page,
  }) => {
    await reachPhotoStep(page, application.url, "자전거", "300000");

    await page.locator('input[type="file"]').setInputFiles(WISH_PHOTO_INPUT);
    await expect(page.getByAltText("선택한 위시 사진")).toBeVisible();
    await page.getByRole("button", { name: "다음" }).click();

    await expect(page.getByText("위시리스트가 생성되었어요!")).toBeVisible();
    await expect(page.getByAltText("위시 사진")).toBeVisible();
    expect(application.state.uploads).toHaveLength(1);
    expect(application.state.uploads[0].contentType).toContain(
      "multipart/form-data; boundary=",
    );
    expect(application.state.uploads[0].bytes.toString("latin1")).toContain(
      "image/jpeg",
    );
    expect(application.state.creations).toHaveLength(1);
    expect(application.state.creations[0]).toMatchObject({
      accountId: ACCOUNT_ID,
      authorization: "Bearer wish-photo-owner-token",
      body: {
        purpose: "자전거",
        targetAmount: 300_000,
        targetDate: null,
        photoId: "33333333-3333-4333-8333-333333333333",
      },
    });
  });
});

async function reachPhotoStep(page, applicationUrl, purpose, amount) {
  await page.goto(`${applicationUrl}/wishes/new`);
  await page.getByLabel("위시", { exact: true }).fill(purpose);
  await page.getByLabel("위시 금액", { exact: true }).fill(amount);
  await page.getByRole("button", { name: "다음" }).click();

  await expect(page).toHaveURL((url) => {
    return (
      url.pathname === "/wishes/new/period" &&
      url.searchParams.get("cardBalanceAccountId") === ACCOUNT_ID
    );
  });
  await page.getByRole("button", { name: "넘어가기" }).click();

  await expect(page).toHaveURL((url) => {
    return (
      url.pathname === "/wishes/new/photo" &&
      url.searchParams.get("cardBalanceAccountId") === ACCOUNT_ID
    );
  });
  await expect(
    page.getByRole("button", { name: "위시 사진 선택" }),
  ).toBeVisible();
}
