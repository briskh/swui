import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingState,
  SourceCode,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@swqt/ui";
import { PortalPageHeader } from "../components/PortalPageHeader";
import { buildNpmrcTemplate, DEFAULT_NPM_REGISTRY, isPublicNpmRegistry } from "../../shared/registry-install";

interface RegistryPayload {
  stale: boolean;
  cachedAt: string | null;
  live: boolean;
  registry: string;
  data: {
    name: string;
    "dist-tags": Record<string, string>;
    versions: Record<string, { peerDependencies?: Record<string, string> }>;
  } | null;
  error?: string;
}

const PACKAGES = ["@swqt/ui", "@swqt/ui-tokens"] as const;

function encodePackage(name: string) {
  return encodeURIComponent(name);
}

export function PackagesPage() {
  const [entries, setEntries] = useState<RegistryPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const responses = await Promise.all(
        PACKAGES.map(async (name) => {
          const response = await fetch(`/api/registry/${encodePackage(name)}`);
          return (await response.json()) as RegistryPayload;
        })
      );
      if (!cancelled) {
        setEntries(responses);
        setLoading(false);
      }
    }
    load().catch(() => {
      if (!cancelled) {
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const registry = entries[0]?.registry ?? DEFAULT_NPM_REGISTRY;
  const npmrc = buildNpmrcTemplate(registry);
  const requiresAuth = !isPublicNpmRegistry(registry);
  const stale = entries.some((entry) => entry.stale);

  return (
    <div className="flex flex-col gap-6">
      <PortalPageHeader
        title="Packages"
        description={
          <p>
            Read-only registry metadata from <code>{registry}</code>.
            {requiresAuth
              ? " Install requires registry authentication; this page does not mirror tarballs."
              : " Public packages install from npmjs.org with no registry auth; this page does not mirror tarballs."}
          </p>
        }
      >
        {stale ? (
          <Alert variant="warning" className="mt-3" data-testid="registry-stale-banner">
            <AlertDescription>
              Registry metadata is stale or unavailable. Showing last cached values when available.
            </AlertDescription>
          </Alert>
        ) : null}
      </PortalPageHeader>

      {loading ? <LoadingState label="Loading registry metadata…" /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => {
          const latest = entry.data?.["dist-tags"]?.latest;
          const latestMeta = latest ? entry.data?.versions?.[latest] : undefined;
          return (
            <Card key={entry.data?.name ?? entry.error ?? "unknown"} data-testid={`package-card-${entry.data?.name ?? "missing"}`}>
              <CardHeader>
                <CardTitle>{entry.data?.name ?? "Unavailable"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="flex flex-wrap items-center gap-2">
                  Latest:{" "}
                  {latest ? (
                    <Badge variant="ready">{latest}</Badge>
                  ) : (
                    <Badge variant="outline">unknown</Badge>
                  )}
                </p>
                {latestMeta?.peerDependencies ? (
                  <div>
                    <p className="mb-2 font-medium">Peer dependencies</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Package</TableHead>
                          <TableHead>Range</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(latestMeta.peerDependencies).map(([name, range]) => (
                          <TableRow key={name}>
                            <TableCell>
                              <code>{name}</code>
                            </TableCell>
                            <TableCell>{range}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : null}
                {entry.data ? (
                  <div>
                    <p className="font-medium">Versions</p>
                    <p className="text-muted-foreground">{Object.keys(entry.data.versions).join(", ")}</p>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertDescription>{entry.error ?? "No metadata available"}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Install commands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="mb-2 font-medium">Bun</p>
            <div data-testid="install-command-bun">
              <SourceCode language="shell" value="bun add @swqt/ui @swqt/ui-tokens" />
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">npm</p>
            <div data-testid="install-command-npm">
              <SourceCode language="shell" value="npm install @swqt/ui @swqt/ui-tokens" />
            </div>
          </div>
          <div>
            <p className="mb-2 font-medium">{requiresAuth ? ".npmrc template" : ".npmrc (optional)"}</p>
            <div data-testid="npmrc-template">
              <SourceCode language="ini" value={npmrc} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
