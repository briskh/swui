/**
 * SSOT for Portal /colors and /typography allowlists.
 * Keep aligned with examples/portal/src/lib/token-showcase.ts and docs/experience/foundation-contract.md.
 */

/** Tailwind color utility stems (text-*, bg-*, border-*, …). */
export const ALLOWED_COLOR_UTILITIES = new Set([
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "muted",
  "muted-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "passkey",
  "passkey-foreground",
  "border",
  "input",
  "ring",
  "status-ready",
  "status-loading",
  "status-error",
  "metric-instrument",
  "metric-asset",
  "transparent",
  "current",
  "inherit"
]);

/** CSS custom properties allowed in arbitrary color utilities. */
export const ALLOWED_COLOR_CSS_VARS = new Set([
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--muted",
  "--muted-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--passkey",
  "--passkey-foreground",
  "--border",
  "--input",
  "--ring",
  "--status-ready",
  "--status-loading",
  "--status-error",
  "--metric-instrument",
  "--metric-asset",
  "--source-background",
  "--source-foreground",
  "--source-keyword",
  "--source-string",
  "--source-comment",
  "--source-number",
  "--source-tag",
  "--source-attr",
  "--source-punctuation",
  "--tty-background",
  "--tty-foreground",
  "--tty-border",
  "--tty-prompt",
  "--tty-command",
  "--tty-flag",
  "--tty-string",
  "--tty-path",
  "--tty-success",
  "--tty-error",
  "--tty-muted"
]);

export const ALLOWED_FONT_FAMILIES = new Set(["font-sans", "font-serif", "font-mono"]);

export const ALLOWED_FONT_SIZES = new Set([
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl"
]);

export const ALLOWED_FONT_WEIGHTS = new Set(["font-normal", "font-medium", "font-semibold"]);

export const COLOR_UTILITY_PREFIXES =
  /(?:^|\s|["'`])(text|bg|border|ring|outline|fill|stroke|from|to|via|decoration|divide|caret|accent)-/g;

export const STANDARD_COLOR_CLASS =
  /(?:^|\s|["'`])(text|bg|border|ring|outline|fill|stroke|from|to|via|decoration|divide|caret|accent)-([a-z][\w-]*(?:\/\d+)?)/g;

export const ARBITRARY_COLOR_CLASS = /\[(?:color|background-color|border-color|background):var\((--[\w-]+)\)/g;

export const ARBITRARY_FONT_SIZE = /(?:^|\s|["'`])text-\[(?!color:)/g;

export const FORBIDDEN_FONT_SIZE = /\btext-(?:4xl|5xl|6xl|7xl|8xl|9xl)\b/g;

export const FORBIDDEN_FONT_WEIGHT =
  /\bfont-(?:thin|extralight|light|bold|extrabold|black)\b/g;

export const FORBIDDEN_RAW_COLOR =
  /(?:^|[^#&])#(?:[\da-fA-F]{3,8})\b|(?:^|[^(\w])"(?:#(?:[\da-fA-F]{3,8})|rgb|hsl|oklch)\(|(?:^|[^(\w])'(?:#(?:[\da-fA-F]{3,8})|rgb|hsl|oklch)\(/g;
