import {
  Badge,
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@swqt/ui";
import { FoundationNotice } from "../components/FoundationNotice";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { FOUNDATION_COLORS, SEMANTIC_COLORS, type ColorSwatch } from "../lib/token-showcase";

function Swatch({ swatch }: { swatch: ColorSwatch }) {
  return (
    <Card data-testid={`swatch-${swatch.token}`}>
      <CardContent className="grid gap-2 p-3">
        <div
          className={`flex h-16 items-center justify-center rounded-md border border-border/60 ${swatch.className} ${swatch.foregroundClassName ?? "text-foreground"}`}
        >
          <span className="text-sm font-medium">{swatch.name}</span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-mono">
            {swatch.token}
          </Badge>
          <p>{swatch.className}</p>
          {swatch.note ? <p>{swatch.note}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function SwatchGrid({ items }: { items: ColorSwatch[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((swatch) => (
        <Swatch key={swatch.token} swatch={swatch} />
      ))}
    </div>
  );
}

export function ColorSchemePage() {
  return (
    <div className="flex flex-col gap-8">
      <PortalPageHeader
        title="Colors"
        description={
          <p>
            Semantic palette from <code>@swqt/ui-tokens</code>. Values follow the active theme via{" "}
            <code>ThemeProvider</code>; toggle light/dark in the header to compare surfaces.
          </p>
        }
      />

      <Tabs defaultValue="foundations">
        <TabsList>
          <TabsTrigger value="foundations">Foundations</TabsTrigger>
          <TabsTrigger value="semantics">Product semantics</TabsTrigger>
        </TabsList>
        <TabsContent value="foundations" className="mt-4">
          <SwatchGrid items={FOUNDATION_COLORS} />
        </TabsContent>
        <TabsContent value="semantics" className="mt-4">
          <SwatchGrid items={SEMANTIC_COLORS} />
        </TabsContent>
      </Tabs>

      <FoundationNotice>
        <p>
          SSOT: <code>packages/ui-tokens/src/tokens.css</code> and{" "}
          <code>docs/experience/foundation-contract.md</code>. Prefer utilities such as{" "}
          <code>bg-primary</code> and <code>text-muted-foreground</code> instead of hard-coded chroma.
        </p>
      </FoundationNotice>
    </div>
  );
}
