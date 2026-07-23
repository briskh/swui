import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPortalMiddleware } from "./server/handlers";

const root = path.dirname(fileURLToPath(import.meta.url));
const uiSrc = path.resolve(root, "../../packages/ui/src");

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "portal-api",
      configureServer(server) {
        server.middlewares.use(createPortalMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(createPortalMiddleware());
      }
    }
  ],
  resolve: {
    alias: [
      { find: "@swui/ui/utils", replacement: path.join(uiSrc, "lib/utils.ts") },
      { find: "@swui/ui/date", replacement: path.join(uiSrc, "lib/date.ts") },
      { find: "@swui/ui/theme", replacement: path.join(uiSrc, "theme.tsx") },
      { find: "@swui/ui/wide-screen-gate", replacement: path.join(uiSrc, "components/wide-screen-gate.tsx") },
      { find: "@swui/ui/button", replacement: path.join(uiSrc, "components/button.tsx") },
      { find: "@swui/ui/card", replacement: path.join(uiSrc, "components/card.tsx") },
      { find: "@swui/ui/form-field", replacement: path.join(uiSrc, "components/form-field.tsx") },
      { find: "@swui/ui/form", replacement: path.join(uiSrc, "components/form.tsx") },
      { find: "@swui/ui", replacement: path.join(uiSrc, "index.ts") }
    ]
  },
  server: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true
  },
  preview: {
    host: "127.0.0.1",
    port: 4176,
    strictPort: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
