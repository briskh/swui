import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, Button, Card, CardContent, CardHeader, CardTitle, WideScreenGate } from "@swui/ui";
import "./styles.css";

function App() {
  return (
    <ThemeProvider>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        <h1 className="text-2xl font-semibold text-foreground">UI consumer spike</h1>
        <p className="text-sm text-muted-foreground">
          Second-app adoption proof for <code>@swui/ui-tokens</code> and <code>@swui/ui</code>.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Primitives</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </CardContent>
        </Card>
        <WideScreenGate title="Dense table gate" description="Compact viewports see this placeholder instead of dense chrome.">
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">Wide-only content region.</CardContent>
          </Card>
        </WideScreenGate>
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
