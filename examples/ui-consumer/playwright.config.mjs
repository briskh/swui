import { defineConfig } from "@playwright/test";

const viewports = {
  compact: { width: 640, height: 900 },
  "data-dense": { width: 820, height: 900 },
  lg: { width: 1024, height: 900 },
  xl: { width: 1280, height: 900 }
};

export default defineConfig({
  testDir: ".",
  testMatch: "browser.spec.mjs",
  outputDir: ".browser-artifacts/test-results",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:4175",
    browserName: "chromium",
    headless: true,
    colorScheme: "light"
  },
  projects: Object.entries(viewports).flatMap(([viewportName, viewport]) => [
    { name: `light-${viewportName}`, use: { colorScheme: "light", viewport } },
    { name: `dark-${viewportName}`, use: { colorScheme: "dark", viewport } }
  ]),
  expect: {
    toHaveScreenshot: { animations: "disabled", maxDiffPixels: 0 }
  },
  webServer: {
    command: "vite --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI
  }
});
