export type ColorSwatch = {
  name: string;
  token: string;
  className: string;
  foregroundClassName?: string;
  note?: string;
};

export const FOUNDATION_COLORS: ColorSwatch[] = [
  { name: "Background", token: "--background", className: "bg-background", foregroundClassName: "text-foreground", note: "Page canvas" },
  { name: "Foreground", token: "--foreground", className: "bg-foreground", foregroundClassName: "text-background", note: "Primary text" },
  { name: "Card", token: "--card", className: "bg-card", foregroundClassName: "text-card-foreground", note: "Raised surfaces" },
  { name: "Popover", token: "--popover", className: "bg-popover", foregroundClassName: "text-popover-foreground", note: "Overlay panels" },
  { name: "Muted", token: "--muted", className: "bg-muted", foregroundClassName: "text-muted-foreground", note: "Quiet surfaces" },
  { name: "Primary", token: "--primary", className: "bg-primary", foregroundClassName: "text-primary-foreground", note: "Primary actions" },
  { name: "Secondary", token: "--secondary", className: "bg-secondary", foregroundClassName: "text-secondary-foreground", note: "Secondary actions" },
  { name: "Accent", token: "--accent", className: "bg-accent", foregroundClassName: "text-accent-foreground", note: "Highlights" },
  { name: "Destructive", token: "--destructive", className: "bg-destructive", foregroundClassName: "text-destructive-foreground", note: "Errors" },
  { name: "Passkey", token: "--passkey", className: "bg-passkey", foregroundClassName: "text-passkey-foreground", note: "WebAuthn CTA" },
  { name: "Border", token: "--border", className: "bg-border", foregroundClassName: "text-foreground", note: "Dividers" },
  { name: "Input", token: "--input", className: "bg-input", foregroundClassName: "text-foreground", note: "Field borders" },
  { name: "Ring", token: "--ring", className: "bg-ring", foregroundClassName: "text-background", note: "Focus ring" }
];

export const SEMANTIC_COLORS: ColorSwatch[] = [
  { name: "Status ready", token: "--status-ready", className: "bg-status-ready", foregroundClassName: "text-background", note: "Healthy" },
  { name: "Status loading", token: "--status-loading", className: "bg-status-loading", foregroundClassName: "text-primary-foreground", note: "In flight" },
  { name: "Status error", token: "--status-error", className: "bg-status-error", foregroundClassName: "text-destructive-foreground", note: "Failed" },
  { name: "Metric instrument", token: "--metric-instrument", className: "bg-metric-instrument", foregroundClassName: "text-primary-foreground", note: "Charts" },
  { name: "Metric asset", token: "--metric-asset", className: "bg-metric-asset", foregroundClassName: "text-background", note: "Asset lines" }
];

export const FONT_SANS_STACK =
  'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

/** System-local serif stack — no CDN or bundled @font-face in @swqt/ui-tokens. */
export const FONT_SERIF_STACK =
  'ui-serif, "Songti SC", "SimSun", "Noto Serif CJK SC", "New York", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, Cambria, "Times New Roman", Times, serif';

/** System-local monospace stack — no CDN or bundled @font-face in @swqt/ui-tokens. */
export const FONT_MONO_STACK =
  'ui-monospace, "SF Mono", "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Noto Sans Mono CJK SC", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/** @deprecated Use FONT_SANS_STACK */
export const FONT_STACK = FONT_SANS_STACK;

export const TYPE_SCALE = [
  { label: "Display / 3xl", className: "text-3xl font-semibold", sample: "Shared Web UI" },
  { label: "Heading / 2xl", className: "text-2xl font-semibold", sample: "Component catalog" },
  { label: "Title / xl", className: "text-xl font-semibold", sample: "Package install" },
  { label: "Section / lg", className: "text-lg font-medium", sample: "Design conventions" },
  { label: "Body / base", className: "text-base", sample: "Use semantic tokens for every surface and control." },
  { label: "UI / sm", className: "text-sm", sample: "Labels, helper text, and compact controls" },
  { label: "Caption / xs", className: "text-xs", sample: "Metadata, timestamps, and dense tables" }
] as const;

export const FONT_WEIGHTS = [
  { label: "Regular / 400", className: "font-normal", sample: "Primary reading text" },
  { label: "Medium / 500", className: "font-medium", sample: "Navigation and section labels" },
  { label: "Semibold / 600", className: "font-semibold", sample: "Headings and emphasis" }
] as const;
