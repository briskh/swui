import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const uiSrc = path.resolve(root, "../../packages/ui/src");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@swqt/ui/utils": path.join(uiSrc, "lib/utils.ts"),
      "@swqt/ui/date": path.join(uiSrc, "lib/date.ts"),
      "@swqt/ui/theme": path.join(uiSrc, "theme.tsx"),
      "@swqt/ui/wide-screen-gate": path.join(uiSrc, "components/wide-screen-gate.tsx"),
      "@swqt/ui/button": path.join(uiSrc, "components/button.tsx"),
      "@swqt/ui/card": path.join(uiSrc, "components/card.tsx"),
      "@swqt/ui": path.join(uiSrc, "index.ts")
    }
  }
});
