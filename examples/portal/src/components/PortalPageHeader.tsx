import type { ReactNode } from "react";

type PortalPageHeaderProps = {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
};

export function PortalPageHeader({ title, description, children }: PortalPageHeaderProps) {
  return (
    <section>
      <h2 className="text-3xl font-semibold">{title}</h2>
      {description ? <div className="mt-3 max-w-3xl text-muted-foreground">{description}</div> : null}
      {children}
    </section>
  );
}
