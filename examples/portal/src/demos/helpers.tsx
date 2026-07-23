import type { ReactNode } from "react";
import { Alert, AlertDescription, Separator } from "@swqt/ui";

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
    <Alert>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}

export function DemoStack({ children }: { children: ReactNode }) {
  return <div className="grid gap-6">{children}</div>;
}

export function DemoDivider() {
  return <Separator />;
}
