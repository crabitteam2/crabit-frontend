import { writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { startMonthlyApp } from "./support/monthly-recap-month-selector-app.mjs";

test.describe("monthly selector on the real Next route", () => {
  test.describe.configure({ mode: "serial", timeout: 120_000 });
  let app;
  test.beforeAll(async () => {
    app = await startMonthlyApp();
  });
  test.afterAll(async () => {
    await app?.close();
  });

  for (const width of [1280, 375]) {
    test(`same-year geometry and navigation at ${width}px`, async ({
      browser,
    }, info) => {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        hasTouch: width === 375,
        isMobile: width === 375,
      });
      const page = await context.newPage();
      await page.goto(`${app.url}/recaps/monthly?month=2025-08`);
      const nav = page.getByRole("navigation", { name: "월 선택" });
      await expect(nav).toBeVisible();
      await page.waitForTimeout(500);
      await nav.evaluate((el) => {
        el.scrollLeft = 400;
      });
      await page.evaluate(() => {
        window.selectorSamples = [];
        window.selectorSampling = true;
        const sample = () => {
          const nav = document.querySelector('nav[aria-label="월 선택"]');
          window.selectorSamples.push(
            nav
              ? {
                  left: nav.scrollLeft,
                  x: [...nav.children].map(
                    (el) => el.getBoundingClientRect().x,
                  ),
                }
              : null,
          );
          if (window.selectorSampling) requestAnimationFrame(sample);
        };
        sample();
      });
      const baseline = await nav.evaluate((el) => ({
        left: el.scrollLeft,
        x: [...el.children].map((item) => item.getBoundingClientRect().x),
      }));
      for (const month of [6, 7, 8, 9, 8]) {
        const target = nav.getByText(`${month}월`, { exact: true });
        if (width === 375) await target.tap();
        else await target.click();
        await expect(nav.locator('[aria-current="page"]')).toHaveText(
          `${month}월`,
        );
        await expect(page).toHaveURL(
          new RegExp(`month=2025-${String(month).padStart(2, "0")}$`),
        );
        if ([5, 8].includes(month))
          await expect(
            page.getByText(`2025-${String(month).padStart(2, "0")} 저축 결과`),
          ).toBeVisible();
      }
      await page.goBack();
      await expect(nav.locator('[aria-current="page"]')).toHaveText("9월");
      await page.goForward();
      await expect(nav.locator('[aria-current="page"]')).toHaveText("8월");
      await page.waitForTimeout(100);
      const samples = await page.evaluate(() => {
        window.selectorSampling = false;
        return window.selectorSamples;
      });
      const evidencePath = info.outputPath("geometry.json");
      await writeFile(
        evidencePath,
        JSON.stringify({ width, baseline, samples }),
      );
      await info.attach("geometry.json", {
        path: evidencePath,
        contentType: "application/json",
      });
      expect(
        samples.every(
          (sample) =>
            sample !== null &&
            Math.abs(sample.left - baseline.left) <= 1 &&
            sample.x.every((x, index) => Math.abs(x - baseline.x[index]) <= 1),
        ),
      ).toBe(true);
      await context.close();
    });
  }
  test("entry, year change, rapid delayed selection and keyboard focus", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    const nav = page.getByRole("navigation", { name: "월 선택" });
    for (const month of ["01", "12"]) {
      await page.goto(`${app.url}/recaps/monthly?month=2025-${month}`);
      await expect(nav.locator('[aria-current="page"]')).toBeInViewport();
    }
    await nav.evaluate((el) => {
      el.scrollLeft = 220;
    });
    const baseline = await nav.evaluate((el) => el.scrollLeft);
    await nav.getByRole("link", { name: "4월", exact: true }).click();
    await nav.getByRole("link", { name: "5월", exact: true }).click();
    await expect(nav.locator('[aria-current="page"]')).toHaveText("5월");
    await expect(page.getByText("2025-05 저축 결과")).toBeVisible();
    await page.waitForTimeout(800);
    await expect(nav.locator('[aria-current="page"]')).toHaveText("5월");
    expect(await nav.evaluate((el) => el.scrollLeft)).toBe(baseline);
    const fourth = nav.getByRole("link", { name: "4월", exact: true });
    await fourth.focus();
    await page.keyboard.press("Enter");
    await expect(fourth).toHaveAttribute("aria-current", "page");
    await expect(fourth).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(fourth).toBeFocused();
    expect(await nav.evaluate((el) => el.scrollLeft)).toBe(baseline);
    await page.getByRole("button", { name: "2025", exact: true }).click();
    await page.getByRole("link", { name: "2024", exact: true }).click();
    await expect(page).toHaveURL(/year=2024$/);
    await expect(nav.locator('[aria-current="page"]')).toHaveText("12월");
    await expect(nav.locator('[aria-current="page"]')).toBeInViewport();
  });

  for (const touch of [false, true]) {
    test(`manual ${touch ? "touch swipe" : "horizontal wheel"} before and after selection`, async ({
      browser,
    }, info) => {
      const context = await browser.newContext({
        viewport: { width: touch ? 375 : 1280, height: 900 },
        hasTouch: touch,
        isMobile: touch,
      });
      try {
        const page = await context.newPage();
        await page.goto(`${app.url}/recaps/monthly?month=2025-08`);
        const nav = page.getByRole("navigation", { name: "월 선택" });
        await expect(nav.locator('[aria-current="page"]')).toBeInViewport();
        // Wait for hydration and initial positioning before delivering native browser input.
        await page.waitForTimeout(300);
        const cdp = touch ? await context.newCDPSession(page) : null;
        async function scroll(direction) {
          const box = await nav.boundingBox();
          const y = box.y + box.height / 2;
          if (touch) {
            const start = box.x + (direction < 0 ? 80 : box.width - 80);
            await cdp.send("Input.dispatchTouchEvent", {
              type: "touchStart",
              touchPoints: [{ x: start, y }],
            });
            for (let step = 1; step <= 8; step++) {
              await cdp.send("Input.dispatchTouchEvent", {
                type: "touchMove",
                touchPoints: [{ x: start - direction * step * 15, y }],
              });
              await page.waitForTimeout(35);
            }
            await cdp.send("Input.dispatchTouchEvent", {
              type: "touchEnd",
              touchPoints: [],
            });
          } else {
            await page.mouse.move(box.x + box.width / 2, y);
            await page.mouse.wheel(direction * 150, 0);
          }
          await page.waitForTimeout(500);
        }
        const initial = await nav.evaluate((el) => el.scrollLeft);
        await scroll(-1);
        const before = await nav.evaluate((el) => ({
          left: el.scrollLeft,
          x: [...el.children].map((item) => item.getBoundingClientRect().x),
        }));
        expect(before.left).toBeLessThan(initial - 20);
        const targetLabel = await nav.evaluate((el) => {
          const box = el.getBoundingClientRect();
          const candidates = [
            ...el.querySelectorAll("a:not([aria-current])"),
          ].filter((link) => {
            const item = link.getBoundingClientRect();
            return item.left >= box.left + 8 && item.right <= box.right - 8;
          });
          return candidates[Math.floor(candidates.length / 2)].textContent;
        });
        const target = nav.getByRole("link", {
          name: targetLabel,
          exact: true,
        });
        if (touch) await target.tap();
        else await target.click();
        await expect(target).toHaveAttribute("aria-current", "page");
        const after = await nav.evaluate((el) => ({
          left: el.scrollLeft,
          x: [...el.children].map((item) => item.getBoundingClientRect().x),
        }));
        expect(Math.abs(after.left - before.left)).toBeLessThanOrEqual(1);
        expect(
          after.x.every((x, index) => Math.abs(x - before.x[index]) <= 1),
        ).toBe(true);
        await scroll(1);
        const final = await nav.evaluate((el) => el.scrollLeft);
        expect(final).toBeGreaterThan(after.left + 20);
        const path = info.outputPath("manual-scroll.json");
        await writeFile(
          path,
          JSON.stringify({
            touch,
            initial,
            before,
            selected: targetLabel,
            after,
            final,
          }),
        );
        await info.attach("manual-scroll.json", {
          path,
          contentType: "application/json",
        });
      } finally {
        await context.close();
      }
    });
  }
});
