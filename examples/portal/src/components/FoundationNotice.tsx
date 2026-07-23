import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@swqt/ui";

type FoundationNoticeProps = {
  children: ReactNode;
  "data-testid"?: string;
};

export function FoundationNotice({ children, "data-testid": testId }: FoundationNoticeProps) {
  return (
    <Alert data-testid={testId}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
