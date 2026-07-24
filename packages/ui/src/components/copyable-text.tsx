import { Check, Copy } from "lucide-react";
import * as React from "react";
import { copyText } from "../lib/copy-text";
import { cn } from "../lib/utils";
import { Button } from "./button";

export type CopyableTextProps = {
  value: string;
  /** Visible content; defaults to `value`. */
  display?: React.ReactNode;
  mono?: boolean;
  className?: string;
  copyLabel?: string;
  copiedLabel?: string;
  copyButtonClassName?: string;
  onCopy?: () => void;
  onCopyError?: (error: unknown) => void;
};

/** Inline value with an icon-compact copy control (SourceCode-aligned UX, no toast). */
export function CopyableText({
  value,
  display,
  mono = false,
  className,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  copyButtonClassName,
  onCopy,
  onCopyError
}: CopyableTextProps) {
  const [copied, setCopied] = React.useState(false);
  const resetTimerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    []
  );

  const handleCopy = React.useCallback(async () => {
    try {
      await copyText(value);
      setCopied(true);
      onCopy?.();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onCopyError?.(error);
    }
  }, [onCopy, onCopyError, value]);

  const visible = display ?? value;

  return (
    <span className={cn("inline-flex min-w-0 max-w-full items-center gap-1", className)}>
      <span className={cn("min-w-0 break-all text-sm text-foreground", mono && "font-mono")}>{visible}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-compact"
        className={cn("shrink-0 text-muted-foreground hover:text-foreground", copyButtonClassName)}
        aria-label={copied ? copiedLabel : copyLabel}
        onClick={() => void handleCopy()}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
    </span>
  );
}
