import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "browser.spec.mjs",
  outputDir: ".browser-artifacts/test-results",
  fullyParallel: false,
  use: {
    baseURL: "http://127.0.0.1:4176",
    browserName: "chromium",
    headless: true,
    colorScheme: "light"
  },
  projects: [
    { name: "light", use: { colorScheme: "light" } },
    { name: "dark", use: { colorScheme: "dark" } }
  ],
  webServer: {
    command: "bun run build && REGISTRY_FIXTURE=1 vite preview --host 127.0.0.1 --port 4176 --strictPort",
    url: "http://127.0.0.1:4176",
    reuseExistingServer: !process.env.CI,
    env: {
      REGISTRY_FIXTURE: "1"
    }
  }
});
