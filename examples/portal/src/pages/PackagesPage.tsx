import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@swqt/ui";
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
      <section>
        <h2 className="text-3xl font-semibold">Packages</h2>
        <p className="mt-2 text-muted-foreground">
          Read-only registry metadata from <code>{registry}</code>.
          {requiresAuth
            ? " Install requires registry authentication; this page does not mirror tarballs."
            : " Public packages install from npmjs.org with no registry auth; this page does not mirror tarballs."}
        </p>
        {stale ? (
          <p className="mt-3 rounded-md border border-border bg-muted px-3 py-2 text-sm" data-testid="registry-stale-banner">
            Registry metadata is stale or unavailable. Showing last cached values when available.
          </p>
        ) : null}
      </section>
      {loading ? <p>Loading registry metadata…</p> : null}
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
                <p>
                  Latest: <strong>{latest ?? "unknown"}</strong>
                </p>
                {latestMeta?.peerDependencies ? (
                  <div>
                    <p className="font-medium">Peer dependencies</p>
                    <ul className="list-disc pl-5">
                      {Object.entries(latestMeta.peerDependencies).map(([name, range]) => (
                        <li key={name}>
                          <code>{name}</code>: {range}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {entry.data ? (
                  <div>
                    <p className="font-medium">Versions</p>
                    <p className="text-muted-foreground">{Object.keys(entry.data.versions).join(", ")}</p>
                  </div>
                ) : (
                  <p className="text-destructive">{entry.error ?? "No metadata available"}</p>
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
            <p className="font-medium">Bun</p>
            <pre data-testid="install-command-bun">
              <code>bun add @swqt/ui @swqt/ui-tokens</code>
            </pre>
          </div>
          <div>
            <p className="font-medium">npm</p>
            <pre data-testid="install-command-npm">
              <code>npm install @swqt/ui @swqt/ui-tokens</code>
            </pre>
          </div>
          <div>
            <p className="font-medium">{requiresAuth ? ".npmrc template" : ".npmrc (optional)"}</p>
            <pre data-testid="npmrc-template">
              <code>{npmrc}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
