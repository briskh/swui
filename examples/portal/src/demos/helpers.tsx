import type { ReactNode } from "react";

export function DemoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

export function DocumentedException({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">{children}</div>
  );
}

export function DemoStack({ children }: { children: ReactNode }) {
  return <div className="grid gap-6">{children}</div>;
}
