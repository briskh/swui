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
    alias: {
      "@swui/ui/utils": path.join(uiSrc, "lib/utils.ts"),
      "@swui/ui/date": path.join(uiSrc, "lib/date.ts"),
      "@swui/ui/theme": path.join(uiSrc, "theme.tsx"),
      "@swui/ui/wide-screen-gate": path.join(uiSrc, "components/wide-screen-gate.tsx"),
      "@swui/ui/button": path.join(uiSrc, "components/button.tsx"),
      "@swui/ui/card": path.join(uiSrc, "components/card.tsx"),
      "@swui/ui": path.join(uiSrc, "index.ts")
    }
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
