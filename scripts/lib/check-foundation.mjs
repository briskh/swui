import {
  ALLOWED_COLOR_CSS_VARS,
  ALLOWED_COLOR_UTILITIES,
  ALLOWED_FONT_FAMILIES,
  ALLOWED_FONT_SIZES,
  ALLOWED_FONT_WEIGHTS,
  ARBITRARY_COLOR_CLASS,
  FORBIDDEN_FONT_SIZE,
  FORBIDDEN_FONT_WEIGHT,
  FORBIDDEN_RAW_COLOR
} from "./foundation-allowlist.mjs";

const TEXT_NON_COLOR = new Set([
  "left",
  "center",
  "right",
  "justify",
  "start",
  "end",
  "balance",
  "pretty",
  "nowrap",
  "wrap",
  "clip",
  "ellipsis",
  "underline",
  "overline",
  "line-through",
  "no-underline"
]);

const BORDER_NON_COLOR = new Set(["b", "t", "l", "r", "x", "y", "collapse", "0", "2", "4", "8", "dashed", "dotted", "double", "solid", "hidden"]);

const OUTLINE_NON_COLOR = new Set(["none", "0", "1", "2", "4", "8", "hidden"]);

const RING_NON_COLOR = new Set(["0", "1", "2", "4", "8", "inset", "offset-0", "offset-1", "offset-2", "offset-4", "offset-8"]);

function inspectColorUtility(prefix, token) {
  const stem = token.split("/")[0];

  if (prefix === "text") {
    if (ALLOWED_FONT_SIZES.has(`text-${stem}`) || TEXT_NON_COLOR.has(stem)) {
      return null;
    }
  } else if (prefix === "border") {
    const directional = stem.match(/^([tblrxy])-(.+)$/);
    if (directional) {
      const rest = directional[2];
      if (["0", "2", "4", "8", "dashed", "dotted", "double", "solid", "hidden"].includes(rest)) {
        return null;
      }
      if (ALLOWED_COLOR_UTILITIES.has(rest)) {
        return null;
      }
    }
    if (BORDER_NON_COLOR.has(stem)) {
      return null;
    }
  } else if (prefix === "outline") {
    if (OUTLINE_NON_COLOR.has(stem) || stem.startsWith("offset-")) {
      return null;
    }
  } else if (prefix === "ring") {
    if (RING_NON_COLOR.has(stem) || stem.startsWith("offset-")) {
      return null;
    }
  }

  if (prefix === "bg" && stem.startsWith("gradient")) {
    return null;
  }

  if (prefix === "from" || prefix === "to" || prefix === "via") {
    if (ALLOWED_COLOR_UTILITIES.has(stem)) {
      return null;
    }
  }

  if (!ALLOWED_COLOR_UTILITIES.has(stem)) {
    return `${prefix}-${token}`;
  }

  return null;
}

const COLOR_CLASS =
  /(?:^|\s|["'`])(text|bg|border|ring|outline|fill|stroke|from|to|via|decoration|divide|caret|accent)-([a-z][\w-]*(?:\/\d+)?)/g;

const ARBITRARY_FONT_SIZE = /(?:^|\s|["'`])text-\[(?!color:)/g;

export function checkFoundationSource({ source, fileLabel = "", rawColorExceptions = [] }) {
  const violations = [];

  for (const match of source.matchAll(COLOR_CLASS)) {
    const issue = inspectColorUtility(match[1], match[2]);
    if (issue) {
      violations.push(`${fileLabel}:${match.index}: unapproved color utility ${issue}`);
    }
  }

  for (const match of source.matchAll(ARBITRARY_COLOR_CLASS)) {
    if (!ALLOWED_COLOR_CSS_VARS.has(match[1])) {
      violations.push(`${fileLabel}:${match.index}: unapproved CSS variable ${match[1]}`);
    }
  }

  for (const match of source.matchAll(FORBIDDEN_RAW_COLOR)) {
    const literal = match[0].trim().replace(/^[^#"']*/, "");
    if (rawColorExceptions.some((allowed) => literal.includes(allowed) || match[0].includes(allowed))) {
      continue;
    }
    violations.push(`${fileLabel}:${match.index}: raw color literal ${match[0].trim()}`);
  }

  for (const match of source.matchAll(FORBIDDEN_FONT_SIZE)) {
    violations.push(`${fileLabel}:${match.index}: unapproved font size ${match[0].trim()}`);
  }

  for (const match of source.matchAll(ARBITRARY_FONT_SIZE)) {
    const snippet = source.slice(match.index, match.index + 24);
    const full = snippet.match(/text-\[[^\]]+\]/)?.[0];
    if (full) {
      violations.push(`${fileLabel}:${match.index}: unapproved arbitrary font size ${full}`);
    }
  }

  for (const match of source.matchAll(FORBIDDEN_FONT_WEIGHT)) {
    violations.push(`${fileLabel}:${match.index}: unapproved font weight ${match[0].trim()}`);
  }

  for (const size of source.matchAll(/\btext-(xs|sm|base|lg|xl|2xl|3xl)\b/g)) {
    const token = `text-${size[1]}`;
    if (!ALLOWED_FONT_SIZES.has(token)) {
      violations.push(`${fileLabel}:${size.index}: unapproved font size ${token}`);
    }
  }

  for (const weight of source.matchAll(/\bfont-(normal|medium|semibold)\b/g)) {
    const token = `font-${weight[1]}`;
    if (!ALLOWED_FONT_WEIGHTS.has(token)) {
      violations.push(`${fileLabel}:${weight.index}: unapproved font weight ${token}`);
    }
  }

  for (const family of source.matchAll(/\bfont-(sans|serif|mono)\b/g)) {
    const token = family[0];
    if (!ALLOWED_FONT_FAMILIES.has(token)) {
      violations.push(`${fileLabel}:${family.index}: unapproved font family ${token}`);
    }
  }

  return violations;
}
