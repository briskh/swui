import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PortalLayout } from "./App";
import { AgentPage } from "./pages/AgentPage";
import { ComponentDemoPage } from "./pages/ComponentDemoPage";
import { ComponentsIndexPage } from "./pages/ComponentsIndexPage";
import { ConventionPage } from "./pages/ConventionPage";
import { HomePage } from "./pages/HomePage";
import { IconsPage } from "./pages/IconsPage";
import { PackagesPage } from "./pages/PackagesPage";
import { ColorSchemePage } from "./pages/ColorSchemePage";
import { TypographyPage } from "./pages/TypographyPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="conventions/:slug" element={<ConventionPage />} />
          <Route path="colors" element={<ColorSchemePage />} />
          <Route path="typography" element={<TypographyPage />} />
          <Route path="icons" element={<IconsPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="components" element={<ComponentsIndexPage />} />
          <Route path="components/:groupSlug/:exportSlug" element={<ComponentDemoPage />} />
          <Route path="agent" element={<AgentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
