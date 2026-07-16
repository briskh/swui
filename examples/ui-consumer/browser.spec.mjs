import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoWcagAaViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test("global theme preference synchronizes across tabs", async ({ context, page }, testInfo) => {
  await page.goto("/");
  const systemTheme = testInfo.project.use.colorScheme;
  await expect(page.locator("html")).toHaveAttribute("data-theme", systemTheme);

  const peerPage = await context.newPage();
  await peerPage.goto("http://127.0.0.1:4175/");

  await page.getByLabel("选择主题").click();
  await page.getByRole("menuitemradio", { name: "深色" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByLabel("选择主题").click();
  await page.getByRole("menuitemradio", { name: "跟随系统" }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("swui-theme-preference"))).toBeNull();
  await expect(page.locator("html")).toHaveAttribute("data-theme", systemTheme);
  const alternateTheme = systemTheme === "dark" ? "light" : "dark";
  await page.emulateMedia({ colorScheme: alternateTheme });
  await expect(page.locator("html")).toHaveAttribute("data-theme", alternateTheme);
  await page.emulateMedia({ colorScheme: systemTheme });
  await expect(page.locator("html")).toHaveAttribute("data-theme", systemTheme);

  await page.getByLabel("选择主题").click();
  await page.getByRole("menuitemradio", { name: "深色" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(peerPage.locator("html")).toHaveAttribute("data-theme", "dark");
  await peerPage.close();
});

test("core components satisfy visual and WCAG checks in every theme and viewport", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Primary" })).toBeVisible();
  await expect(page.getByLabel("Example search")).toBeVisible();
  await expect(page).toHaveScreenshot("core-components.png", { fullPage: true });
  await expectNoWcagAaViolations(page);
});

test("core state matrix exposes named interactive, validation, and empty states", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("state-matrix")).toBeVisible();
  await expect(page.getByTestId("button-default")).toBeEnabled();
  await expect(page.getByTestId("button-focus-visible")).toBeVisible();
  await expect(page.getByTestId("button-disabled")).toBeDisabled();
  await expect(page.getByTestId("button-loading")).toHaveAttribute("aria-busy", "true");
  await expect(page.getByTestId("button-selected")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("button-icon")).toHaveAccessibleName("Add component");
  await expect(page.getByLabel("Invalid field")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel("Disabled field")).toBeDisabled();
  await expect(page.getByLabel("Selected option")).toContainText("Selected option");
  await expect(page.getByLabel("Disabled option")).toBeDisabled();
  const defaultButton = page.getByTestId("button-default");
  const defaultBackground = await defaultButton.evaluate((element) => getComputedStyle(element).backgroundColor);
  await defaultButton.hover();
  await expect.poll(() => defaultButton.evaluate((element) => getComputedStyle(element).backgroundColor)).not.toBe(defaultBackground);
  const focusedButton = page.getByTestId("button-focus-visible");
  await focusedButton.focus();
  await expect(focusedButton).toBeFocused();
  await expect.poll(() => focusedButton.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  const focusedField = page.getByLabel("Focused field");
  await focusedField.focus();
  await expect(focusedField).toBeFocused();
  await expect.poll(() => focusedField.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await page.mouse.move(0, 0);
  await expect(page.getByTestId("empty-state")).toHaveText("No matching components.");
  await expect(page.getByTestId("state-matrix")).toHaveScreenshot("core-state-matrix.png");
  await expectNoWcagAaViolations(page);
});

test("chart exception selectors render semantic metrics in both formal themes", async ({ page }) => {
  await page.goto("/");
  const chart = page.getByTestId("theme-chart");
  await expect(chart).toBeVisible();
  await expect(chart.locator("svg")).toBeVisible();
  await expect(chart.locator(".recharts-line-curve")).toHaveCount(2);
  await expect(chart).toHaveScreenshot("theme-chart.png");
  await expectNoWcagAaViolations(page);
});

test("data-dense boundary gates a real data table at 820px and admits it at 821px", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.endsWith("data-dense"), "Boundary is exercised by the data-dense projects.");
  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Dense data table" }).getByRole("status")).toBeVisible();
  await expect(page.getByRole("table")).toBeHidden();
  await page.setViewportSize({ width: 821, height: 900 });
  await expect(page.getByRole("table")).toBeVisible();
  await expectNoWcagAaViolations(page);
});
