import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Menu,
  Search,
  Settings
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, SourceCode } from "@swqt/ui";
import { Link } from "react-router-dom";
import { PortalPageHeader } from "../components/PortalPageHeader";

const iconExamples = [
  { name: "Search", Icon: Search, use: "Search and filtering" },
  { name: "Settings", Icon: Settings, use: "Configuration" },
  { name: "CheckCircle2", Icon: CheckCircle2, use: "Successful state" },
  { name: "AlertTriangle", Icon: AlertTriangle, use: "Warning state" },
  { name: "ExternalLink", Icon: ExternalLink, use: "External destination" },
  { name: "Menu", Icon: Menu, use: "Navigation menu" }
] as const;

const importExample = `import { Search } from "lucide-react";
import { Button } from "@swqt/ui";

<Button type="button" size="icon" aria-label="Search">
  <Search aria-hidden="true" />
</Button>`;

export function IconsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PortalPageHeader
        title="Icons"
        description={
          <p>
            Use <code>lucide-react</code> named imports only. This page is the active icon reference for consumers; pair
            it with <Link to="/colors">Colors</Link>, <Link to="/typography">Typography</Link>, and the exact{" "}
            <Link to="/components">component demo</Link> before implementing UI.
          </p>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Non-negotiable policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc space-y-1 pl-5">
            <li>Do not add another icon library, paste SVG paths, draw ad hoc SVG icons, or use emoji as controls.</li>
            <li>Decorative icons beside visible text use <code>aria-hidden="true"</code>.</li>
            <li>Icon-only controls use an exported UI control and require an accessible name.</li>
            <li>Use semantic foreground colors and the component&apos;s documented icon size.</li>
          </ul>
          <SourceCode language="tsx" value={importExample} multiline={false} />
        </CardContent>
      </Card>

      <section aria-labelledby="icon-examples-heading" className="space-y-3">
        <h2 id="icon-examples-heading" className="font-serif text-2xl font-semibold">
          Reference set
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {iconExamples.map(({ name, Icon, use }) => (
            <Card key={name}>
              <CardContent className="flex items-center gap-3 p-4">
                <Icon className="size-5 shrink-0 text-foreground" aria-hidden="true" />
                <div>
                  <p className="font-mono text-sm font-medium text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{use}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
