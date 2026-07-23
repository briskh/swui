import { SourceHighlight, sourceLanguageLabel, type SourceCodeLanguage } from "../lib/source-highlight";
import { CopyableMonospacePanel, type CopyableMonospacePanelProps } from "./copyable-monospace-panel";

export type { SourceCodeLanguage };

export type SourceCodeProps = Omit<CopyableMonospacePanelProps, "variant" | "children" | "headerAccessory"> & {
  language?: SourceCodeLanguage | string;
};

/** Monospace source block with language label, syntax highlighting, and copy control. */
export function SourceCode({ language = "text", value, ...props }: SourceCodeProps) {
  return (
    <CopyableMonospacePanel
      {...props}
      value={value}
      variant="source"
      headerAccessory={
        <span className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {sourceLanguageLabel(language)}
        </span>
      }
    >
      <SourceHighlight value={value} language={language} />
    </CopyableMonospacePanel>
  );
}
