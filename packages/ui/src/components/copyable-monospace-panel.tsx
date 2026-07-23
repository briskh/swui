import { Check, Copy } from "lucide-react";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { copyText } from "../lib/copy-text";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";

const panelVariants = cva("overflow-hidden rounded-md border font-mono", {
  variants: {
    variant: {
      source: "border-border bg-[color:var(--source-background)] shadow-sm",
      tty: "border-[color:var(--tty-border)] bg-[color:var(--tty-background)]"
    }
  },
  defaultVariants: {
    variant: "source"
  }
});

const preVariants = cva("m-0 font-mono text-sm leading-relaxed", {
  variants: {
    variant: {
      source: "whitespace-pre-wrap break-words px-4 pb-4 pt-1 text-[color:var(--source-foreground)]",
      tty: "whitespace-pre px-4 pb-4 pt-1 text-sm leading-6 text-[color:var(--tty-foreground)]"
    },
    multiline: {
      true: "",
      false: "overflow-x-auto pb-2.5 pt-0"
    }
  },
  compoundVariants: [
    {
      variant: "source",
      multiline: true,
      className: "whitespace-pre-wrap break-words px-4 pb-4 pt-1"
    }
  ],
  defaultVariants: {
    variant: "source",
    multiline: true
  }
});

export type CopyableMonospacePanelProps = {
  value: string;
  copyValue?: string;
  multiline?: boolean;
  variant?: VariantProps<typeof panelVariants>["variant"];
  className?: string;
  panelClassName?: string;
  preClassName?: string;
  maxHeightClassName?: string;
  copyLabel?: string;
  copiedLabel?: string;
  copyButtonClassName?: string;
  headerAccessory?: React.ReactNode;
  children?: React.ReactNode;
  onCopy?: () => void;
  onCopyError?: (error: unknown) => void;
};

export function CopyableMonospacePanel({
  value,
  copyValue,
  multiline = true,
  variant = "source",
  className,
  panelClassName,
  preClassName,
  maxHeightClassName = "max-h-80",
  copyLabel = "Copy",
  copiedLabel = "Copied",
  copyButtonClassName,
  headerAccessory,
  children,
  onCopy,
  onCopyError
}: CopyableMonospacePanelProps) {
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
      await copyText(copyValue ?? value);
      setCopied(true);
      onCopy?.();
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      onCopyError?.(error);
    }
  }, [copyValue, onCopy, onCopyError, value]);

  const inlinePreClassName = cn(
    "m-0 overflow-x-auto whitespace-pre px-0 py-0 text-sm leading-5",
    variant === "tty" ? "text-[color:var(--tty-foreground)]" : "text-[color:var(--source-foreground)]",
    preClassName
  );

  const content = multiline ? (
    <pre className={cn(preVariants({ variant, multiline }), preClassName)}>{children ?? value}</pre>
  ) : (
    <pre className={inlinePreClassName}>{children ?? value}</pre>
  );

  if (!multiline) {
    return (
      <div className={cn(panelVariants({ variant }), panelClassName, className)}>
        <div className="flex min-h-control-md items-center gap-2 px-3">
          <div className="min-w-0 flex-1 overflow-x-auto">{content}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon-compact"
            className={cn(
              "shrink-0",
              variant === "tty"
                ? "text-[color:var(--tty-foreground)] hover:bg-[color:var(--tty-foreground)]/10"
                : "text-muted-foreground hover:text-foreground",
              copyButtonClassName
            )}
            aria-label={copied ? copiedLabel : copyLabel}
            onClick={() => void handleCopy()}
          >
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(panelVariants({ variant }), panelClassName, className)}>
      <div className="flex items-center justify-between gap-2 px-3 pt-1.5">
        <div className="min-w-0 flex-1">{headerAccessory}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon-compact"
          className={cn(
            "shrink-0",
            variant === "tty"
              ? "text-[color:var(--tty-foreground)] hover:bg-[color:var(--tty-foreground)]/10"
              : "text-muted-foreground hover:text-foreground",
            copyButtonClassName
          )}
          aria-label={copied ? copiedLabel : copyLabel}
          onClick={() => void handleCopy()}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      </div>
      {multiline ? <ScrollArea className={maxHeightClassName}>{content}</ScrollArea> : <div className="overflow-x-auto">{content}</div>}
    </div>
  );
}
