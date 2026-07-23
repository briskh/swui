import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoWcagAaViolations(page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

const conventionRoutes = [
  ["/conventions/design-summary", "Design summary"],
  ["/conventions/do-and-dont", "Do and don't"],
  ["/conventions/adoption", "Adoption"]
];

test("overview and navigation links resolve", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Shared Web UI design system" })).toBeVisible();
  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const [href, label] of [
    ["/colors", "Colors"],
    ["/typography", "Typography"],
    ["/components", "Components"],
    ["/packages", "Packages"],
    ["/agent", "Agent"]
  ]) {
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${href.replace("/", "\\/")}$`));
    await page.goto("/");
  }
  for (const [href, label] of conventionRoutes) {
    await nav.getByRole("button", { name: "Overview pages" }).click();
    await page.getByRole("menuitem", { name: label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${href.replace("/", "\\/")}$`));
    await page.goto("/");
  }
});

for (const [path, heading] of [
  ["/colors", "Colors"],
  ["/typography", "Typography"]
]) {
  test(`foundation page renders: ${heading}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: heading, level: 2 })).toBeVisible();
    await expectNoWcagAaViolations(page);
  });
}

for (const [path, label] of conventionRoutes) {
  test(`convention page renders synced markdown: ${label}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(path);
    await expect(page.locator(".portal-markdown")).toBeVisible();
    await expect(page.getByTestId("page-toc")).toBeVisible();
    await expectNoWcagAaViolations(page);
  });
}

test("adoption page renders code blocks with SourceCode and Tty", async ({ page }) => {
  await page.goto("/conventions/adoption");
  await expect(page.getByRole("button", { name: "Copy" })).toHaveCount(4);
  await expect(page.locator('[class*="tty-background"]')).toHaveCount(1);
  await expect(page.locator('[class*="source-background"]')).toHaveCount(3);
});

test("design summary renders component patterns as a table", async ({ page }) => {
  await page.goto("/conventions/design-summary");
  const table = page.getByRole("table");
  await expect(table).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Need" })).toBeVisible();
  await expect(table.getByRole("columnheader", { name: "Use" })).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(15);
  await expect(page.getByText("| Need | Use |")).toHaveCount(0);
});

test("components index exposes group table of contents", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/components");
  await expect(page.getByTestId("page-toc")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Groups" })).toBeVisible();
});

test("theme control toggles html data-theme", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("选择主题").click();
  await page.getByRole("menuitemradio", { name: "深色" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("packages page shows install guidance without tarball download", async ({ page }) => {
  await page.goto("/packages");
  await expect(page.getByTestId("package-card-@swqt/ui")).toBeVisible();
  await expect(page.getByTestId("package-card-@swqt/ui-tokens")).toBeVisible();
  await expect(page.getByTestId("install-command-bun")).toContainText("bun add @swqt/ui @swqt/ui-tokens");
  await expect(page.getByTestId("install-command-npm")).toContainText("npm install @swqt/ui @swqt/ui-tokens");
  await expect(page.getByTestId("npmrc-template")).toContainText("npmjs.org");
  await expect(page.getByRole("link", { name: /download/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /download/i })).toHaveCount(0);
  await expectNoWcagAaViolations(page);
});

test("agent page exposes dual-slot MCP example", async ({ page }) => {
  await page.goto("/agent");
  await expect(page.getByTestId("mcp-public-url")).toContainText("https://agent.swqt.net/mcp/swui");
  await expect(page.getByTestId("mcp-config-example")).toContainText('"swui"');
  await expect(page.getByTestId("mcp-config-example")).toContainText('"sw"');
  await expect(page.getByTestId("mcp-config-example")).toContainText("https://agent.swqt.net/mcp/swui");
  await expect(page.getByText("swui://packages/ui/llms.txt")).toBeVisible();
  await expect(page.getByText(/default limit is 10 and the maximum is 25/)).toBeVisible();
  await expectNoWcagAaViolations(page);
});

test("registry API returns fixture metadata", async ({ request }) => {
  const response = await request.get("/api/registry/@swqt%2fui");
  expect(response.ok()).toBeTruthy();
  const payload = await response.json();
  expect(payload.data.name).toBe("@swqt/ui");
  expect(payload.stale).toBe(false);
});

test("mcp endpoint accepts initialize", async ({ request }) => {
  const response = await request.post("/mcp/swui", {
    headers: {
      accept: "application/json, text/event-stream",
      "content-type": "application/json"
    },
    data: {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "playwright", version: "1.0.0" }
      }
    }
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.text();
  expect(body).toContain("swui");
});

for (const rejectedPath of ["/mcp", "/mcp/sws", "/mcp/unknown", "/mcp/swui/extra"]) {
  test(`portal does not route ${rejectedPath} to swui MCP`, async ({ request }) => {
    const response = await request.post(rejectedPath, {
      headers: {
        accept: "application/json, text/event-stream",
        "content-type": "application/json"
      },
      data: {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "negative-path", version: "1.0.0" }
        }
      }
    });
    const body = await response.text();
    expect(body).not.toContain('"name":"swui"');
    expect(body).not.toContain('"name": "swui"');
  });
}

test("components index lists catalog groups", async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { name: "Component catalog" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Actions" })).toBeVisible();
  await expect(page.locator('a[href="/components/actions/button"]')).toBeVisible();
  await expectNoWcagAaViolations(page);
});

test("button demo renders variants", async ({ page }) => {
  await page.goto("/components/actions/button");
  await expect(page.getByRole("heading", { name: "Button" })).toBeVisible();
  const demo = page.getByLabel("Button demo");
  await expect(demo.getByRole("button", { name: "Default" }).first()).toBeVisible();
  await expect(demo.getByRole("button", { name: "Passkey" })).toBeVisible();
});

test("dialog demo opens overlay", async ({ page }) => {
  await page.goto("/components/overlay/dialog");
  await expect(page.getByRole("button", { name: "Open dialog" })).toBeVisible();
  await page.getByRole("button", { name: "Open dialog" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("passkey dialog demo opens step-up shell", async ({ page }) => {
  await page.goto("/components/overlay/passkeydialog");
  await expect(page.getByRole("button", { name: "Open passkey dialog" })).toBeVisible();
  await page.getByRole("button", { name: "Open passkey dialog" }).click();
  await expect(page.getByRole("dialog", { name: "Passkey verification required" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Verify passkey" })).toBeVisible();
});

test("source code and tty demos expose copy controls", async ({ page }) => {
  await page.goto("/components/data-display/sourcecode");
  await expect(page.getByText("TSX", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
  await page.goto("/components/data-display/ttyline");
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
  await page.goto("/components/data-display/tty");
  await expect(page.getByRole("button", { name: "Copy" })).toBeVisible();
});

test("form field demo renders labeled input", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/components/forms/formfield");
  await expect(page.getByText("Username")).toBeVisible();
  await expect(page.getByRole("textbox")).toBeVisible();
});
