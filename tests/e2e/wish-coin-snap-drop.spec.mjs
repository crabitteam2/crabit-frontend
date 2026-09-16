import { expect, test } from "@playwright/test";
import {
  startWishCoinApplication,
  WISH_ID,
  SOURCE_ID,
  EVENT_ID,
} from "./support/wish-coin-snap-drop-app.mjs";

test.describe("Wish coin alignment and funding", () => {
  test.describe.configure({ mode: "serial", timeout: 90_000 });
  let application;
  test.beforeAll(async () => {
    application = await startWishCoinApplication();
  });
  test.afterAll(async () => {
    await application?.close();
  });
  test.beforeEach(() => application.reset());

  for (const viewport of [
    { width: 1280, height: 900, touch: false },
    { width: 375, height: 812, touch: true },
    { width: 390, height: 844, touch: true },
  ]) {
    test(`${viewport.width}px ${viewport.touch ? "touch" : "mouse"}: release continuity, ear clearance, fall and one delayed request`, async ({
      browser,
    }, testInfo) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        hasTouch: viewport.touch,
        isMobile: viewport.touch,
      });
      const page = await context.newPage();
      try {
        application.state.delay = 500;
        for (const [name, x, y] of [
          ["top", 196, 310],
          ["bottom", 196, 587],
          ["left", 92, 440],
          ["right", 299, 440],
          ["center", 196, 440],
        ]) {
          await openCoin(page, application.url);
          await page.clock.install({ time: new Date("2026-09-15T00:00:00Z") });
          await page.clock.pauseAt(new Date("2026-09-15T00:00:01Z"));
          const coin = page.getByRole("button", {
            name: "동전을 저금통으로 끌어 넣기",
          });
          await coin.evaluate((el) => {
            window.originalCoin = el;
          });
          await drag(page, coin, x, y, viewport.touch);
          await expect(coin).toHaveAttribute("data-phase", "aligning");
          expect(
            await page.evaluate(() => window.getSelection()?.toString()),
          ).toBe("");
          expect(await coin.evaluate((el) => el === window.originalCoin)).toBe(
            true,
          );
          await expect(coin).toHaveCSS(
            "transform",
            `matrix(1, 0, 0, 1, ${x - 72}, ${y - 72})`,
          );
          const before = application.state.requests.length;
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-release`);
          await page.clock.runFor(320);
          await expect(coin).toHaveAttribute("data-phase", "holding");
          const aligned = await coin.evaluate((el) => {
            const matrix = new DOMMatrix(getComputedStyle(el).transform);
            return { x: matrix.m41, y: matrix.m42 };
          });
          expect(aligned.x).toBeCloseTo(92 + (519 / 1086) * 207 - 217 / 3, 3);
          expect(aligned.y).toBe(150);
          const art = coin.locator("[data-coin-art]");
          await expect(art).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-aligned`);
          await page.clock.runFor(64);
          await expect(coin).toHaveAttribute("data-phase", "holding");
          await page.clock.runFor(96);
          await expect(coin).toHaveAttribute("data-phase", "falling");
          await expect(art).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-early-fall`);
          await page.clock.runFor(160);
          await expect(coin).toHaveAttribute("data-phase", "falling");
          const shrinking = await art.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m11);
          // Allow one requestAnimationFrame of startup variance while requiring
          // a visibly larger midpoint than the former roughly 0.55 scale.
          expect(shrinking).toBeGreaterThan(0.74);
          expect(shrinking).toBeLessThan(0.82);
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-shrinking`);
          await page.clock.runFor(144);
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-before-rim`);
          await page.clock.runFor(32);
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-falling`);
          await page.clock.runFor(32);
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-inside-rim`);
          await page.clock.runFor(32);
          if (name === "bottom")
            await screenshot(page, testInfo, `${viewport.width}-hidden`);
          expect(application.state.requests).toHaveLength(before);
          await page.clock.runFor(48);
          await expect(coin).toHaveAttribute("data-phase", "landed");
          await expect
            .poll(() => application.state.requests.length)
            .toBe(before + 1);
          await drag(page, coin, 196, 440, viewport.touch);
          expect(application.state.requests).toHaveLength(before + 1);
          await expect(page).toHaveURL(
            new RegExp(`/deposit/done\\?event=${EVENT_ID}`),
          );
          expect(application.state.requests.at(-1)).toMatchObject({
            body: { amount: 1234, expectedVersion: 7 },
            idempotencyKey: "coin-e2e-key",
          });
          await page.clock.resume();
        }
      } finally {
        await context.close();
      }
    });
  }

  test("ordinary failure retries the same transfer ticket; reduced motion still submits only once", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    application.state.error = "TEMPORARY";
    await openCoin(page, application.url, SOURCE_ID);
    let coin = page.getByRole("button", {
      name: "동전을 저금통으로 끌어 넣기",
    });
    await drag(page, coin, 196, 440, false);
    await expect.poll(() => application.state.requests.length).toBe(1);
    await expect(coin).toHaveAttribute("data-phase", "idle");
    application.state.error = null;
    await drag(page, coin, 196, 440, false);
    await expect(page).toHaveURL(
      new RegExp(`/deposit/done\\?event=${EVENT_ID}`),
    );
    expect(application.state.requests).toHaveLength(2);
    expect(application.state.requests[0]).toEqual(
      application.state.requests[1],
    );
    expect(application.state.requests[1].body).toEqual({
      sourceWishId: SOURCE_ID,
      destinationWishId: WISH_ID,
      amount: 1234,
      sourceExpectedVersion: 9,
      destinationExpectedVersion: 7,
    });
  });

  test("invalid release returns, and touch cancellation makes no request", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 812 },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    try {
      await openCoin(page, application.url);
      const coin = page.getByRole("button", {
        name: "동전을 저금통으로 끌어 넣기",
      });
      await drag(page, coin, 40, 600, true);
      await expect(coin).toHaveAttribute("data-phase", "idle");
      await expect(coin).toHaveCSS("transform", "matrix(1, 0, 0, 1, -5, 215)");
      await drag(page, coin, 196, 440, true, true);
      await expect(coin).toHaveAttribute("data-phase", "idle");
      expect(application.state.requests).toHaveLength(0);
    } finally {
      await context.close();
    }
  });
});

async function openCoin(page, url, from = "card") {
  const persona = await page.request.post(`${url}/api/e2e/persona`, {
    data: { persona: "owner" },
  });
  expect(persona.status()).toBe(204);
  await page.addInitScript(
    ({ wish, source }) =>
      sessionStorage.setItem(
        `crabit.fund-ticket.deposit:${wish}:${source}`,
        JSON.stringify({ amount: 1234, idempotencyKey: "coin-e2e-key" }),
      ),
    { wish: WISH_ID, source: from },
  );
  await page.goto(`${url}/wishes/${WISH_ID}/deposit/coin?from=${from}`);
  await expect(
    page.getByRole("button", { name: "동전을 저금통으로 끌어 넣기" }),
  ).toHaveAttribute("aria-disabled", "false");
}
async function drag(page, coin, x, y, touch, cancel = false) {
  const box = await coin.boundingBox();
  const area = await coin.locator("..").boundingBox();
  const start = { x: box.x + 72, y: box.y + 72 };
  const end = { x: area.x + x, y: area.y + y };
  if (touch) {
    const session = await page.context().newCDPSession(page);
    await session.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ ...start, id: 1 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ ...end, id: 1 }],
    });
    await session.send("Input.dispatchTouchEvent", {
      type: cancel ? "touchCancel" : "touchEnd",
      touchPoints: [],
    });
    await session.detach();
  } else {
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y);
    await page.mouse.up();
  }
}
async function screenshot(page, testInfo, name) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path });
  await testInfo.attach(name, { path, contentType: "image/png" });
}
