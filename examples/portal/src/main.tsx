import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PortalLayout } from "./App";
import { AgentPage } from "./pages/AgentPage";
import { ConventionPage } from "./pages/ConventionPage";
import { HomePage } from "./pages/HomePage";
import { PackagesPage } from "./pages/PackagesPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route index element={<HomePage />} />
          <Route path="conventions/:slug" element={<ConventionPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="agent" element={<AgentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
