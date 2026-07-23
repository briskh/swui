import * as React from "react";
import { cn } from "../lib/utils";
import { Card, CardContent } from "./card";
import { Spinner } from "./spinner";

export type EmptyStateProps = {
  children: React.ReactNode;
  className?: string;
};

export function EmptyState({ children, className }: EmptyStateProps) {
  return (
    <Card className={className}>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

export type LoadingStateProps = {
  className?: string;
  label?: string;
};

export function LoadingState({ className, label = "Loading" }: LoadingStateProps) {
  return (
    <Card className={cn("flex h-40 items-center justify-center", className)}>
      <CardContent className="flex items-center justify-center p-0">
        <Spinner label={label} />
      </CardContent>
    </Card>
  );
}
