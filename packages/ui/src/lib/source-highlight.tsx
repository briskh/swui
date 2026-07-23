import * as React from "react";

export type SourceCodeLanguage =
  | "tsx"
  | "ts"
  | "typescript"
  | "jsx"
  | "js"
  | "javascript"
  | "json"
  | "css"
  | "bash"
  | "sh"
  | "shell"
  | "text";

const LANGUAGE_LABELS: Record<string, string> = {
  tsx: "TSX",
  ts: "TypeScript",
  typescript: "TypeScript",
  jsx: "JSX",
  js: "JavaScript",
  javascript: "JavaScript",
  json: "JSON",
  css: "CSS",
  bash: "Bash",
  sh: "Shell",
  shell: "Shell",
  text: "Text"
};

const tone = {
  keyword: "text-[color:var(--source-keyword)]",
  string: "text-[color:var(--source-string)]",
  comment: "text-[color:var(--source-comment)] italic",
  number: "text-[color:var(--source-number)]",
  tag: "text-[color:var(--source-tag)]",
  attr: "text-[color:var(--source-attr)]",
  punctuation: "text-[color:var(--source-punctuation)]",
  plain: "text-[color:var(--source-foreground)]"
} as const;

const KEYWORDS = new Set([
  "import",
  "export",
  "from",
  "as",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "typeof",
  "instanceof",
  "in",
  "of",
  "async",
  "await",
  "type",
  "interface",
  "extends",
  "implements",
  "enum",
  "class",
  "public",
  "private",
  "protected",
  "readonly",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "default"
]);

export function normalizeSourceLanguage(language?: string): SourceCodeLanguage {
  const normalized = (language ?? "text").trim().toLowerCase();
  if (normalized in LANGUAGE_LABELS) {
    return normalized as SourceCodeLanguage;
  }
  return "text";
}

export function sourceLanguageLabel(language?: string) {
  return LANGUAGE_LABELS[normalizeSourceLanguage(language)] ?? language?.toUpperCase() ?? "Text";
}

function span(text: string, className: string, key: string) {
  return (
    <span key={key} className={className}>
      {text}
    </span>
  );
}

function isIdentStart(char: string) {
  return /[A-Za-z_$]/.test(char);
}

function isIdentPart(char: string) {
  return /[\w$]/.test(char);
}

function highlightPlain(code: string, keyPrefix: string) {
  return [span(code, tone.plain, `${keyPrefix}-plain`)];
}

function highlightJsLike(code: string, keyPrefix: string, jsx: boolean) {
  const parts: React.ReactNode[] = [];
  let index = 0;

  while (index < code.length) {
    const rest = code.slice(index);

    if (rest.startsWith("//")) {
      const end = code.indexOf("\n", index);
      const slice = end === -1 ? code.slice(index) : code.slice(index, end);
      parts.push(span(slice, tone.comment, `${keyPrefix}-comment-${index}`));
      index += slice.length;
      continue;
    }

    if (rest.startsWith("/*")) {
      const end = code.indexOf("*/", index + 2);
      const slice = end === -1 ? code.slice(index) : code.slice(index, end + 2);
      parts.push(span(slice, tone.comment, `${keyPrefix}-block-${index}`));
      index += slice.length;
      continue;
    }

    const stringMatch = rest.match(/^(`(?:\\.|[^`\\])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/);
    if (stringMatch) {
      parts.push(span(stringMatch[0], tone.string, `${keyPrefix}-string-${index}`));
      index += stringMatch[0].length;
      continue;
    }

    if (jsx && code[index] === "<") {
      const closeTag = rest.match(/^<\/?[A-Za-z][\w.-]*/);
      if (closeTag) {
        parts.push(span(closeTag[0], tone.tag, `${keyPrefix}-tag-${index}`));
        index += closeTag[0].length;
        continue;
      }
      if (rest.startsWith("/>") || rest.startsWith(">")) {
        const token = rest.startsWith("/>") ? "/>" : ">";
        parts.push(span(token, tone.punctuation, `${keyPrefix}-jsx-${index}`));
        index += token.length;
        continue;
      }
    }

    const numberMatch = rest.match(/^(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)/);
    if (numberMatch) {
      parts.push(span(numberMatch[0], tone.number, `${keyPrefix}-number-${index}`));
      index += numberMatch[0].length;
      continue;
    }

    if (isIdentStart(code[index] ?? "")) {
      let end = index + 1;
      while (end < code.length && isIdentPart(code[end] ?? "")) {
        end += 1;
      }
      const word = code.slice(index, end);
      const nextNonSpace = code.slice(end).match(/^\s*(\w)/)?.[1];
      const isFunction = nextNonSpace === "(";
      if (KEYWORDS.has(word)) {
        parts.push(span(word, tone.keyword, `${keyPrefix}-kw-${index}`));
      } else if (isFunction) {
        parts.push(span(word, tone.attr, `${keyPrefix}-fn-${index}`));
      } else if (/^[A-Z]/.test(word)) {
        parts.push(span(word, tone.tag, `${keyPrefix}-type-${index}`));
      } else {
        parts.push(span(word, tone.plain, `${keyPrefix}-ident-${index}`));
      }
      index = end;
      continue;
    }

    if (/[{}\[\]();:,=<>]/.test(code[index] ?? "")) {
      parts.push(span(code[index] ?? "", tone.punctuation, `${keyPrefix}-p-${index}`));
      index += 1;
      continue;
    }

    parts.push(span(code[index] ?? "", tone.plain, `${keyPrefix}-ch-${index}`));
    index += 1;
  }

  return parts.length > 0 ? parts : highlightPlain(code, keyPrefix);
}

function highlightJson(code: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const pattern = /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\]:,]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(span(code.slice(lastIndex, match.index), tone.plain, `${keyPrefix}-gap-${lastIndex}`));
    }
    const token = match[0];
    let className: string = tone.plain;
    if (/^"/.test(token)) {
      className = code[match.index + token.length] === ":" || code.slice(match.index + token.length).match(/^\s*:/) ? tone.attr : tone.string;
    } else if (token === "true" || token === "false" || token === "null") {
      className = tone.keyword;
    } else if (/^[\d-]/.test(token)) {
      className = tone.number;
    } else {
      className = tone.punctuation;
    }
    parts.push(span(token, className, `${keyPrefix}-tok-${match.index}`));
    lastIndex = match.index + token.length;
  }

  if (lastIndex < code.length) {
    parts.push(span(code.slice(lastIndex), tone.plain, `${keyPrefix}-rest`));
  }

  return parts.length > 0 ? parts : highlightPlain(code, keyPrefix);
}

function highlightCss(code: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const pattern = /\/\*[\s\S]*?\*\/|--[\s\S]*?(?:\n|$)|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[\w-]+|\.[\w-]+|[\w-]+(?=\s*:)|\b[\d.]+(?:px|rem|em|vh|vw|%)?\b|[{}:;]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      parts.push(span(code.slice(lastIndex, match.index), tone.plain, `${keyPrefix}-gap-${lastIndex}`));
    }
    const token = match[0];
    let className: string = tone.plain;
    if (token.startsWith("/*") || token.startsWith("--")) {
      className = tone.comment;
    } else if (token.startsWith('"') || token.startsWith("'")) {
      className = tone.string;
    } else if (token.startsWith("#") || token.startsWith(".")) {
      className = tone.tag;
    } else if (/^\d/.test(token)) {
      className = tone.number;
    } else if (/^[{}:;]$/.test(token)) {
      className = tone.punctuation;
    } else {
      className = tone.attr;
    }
    parts.push(span(token, className, `${keyPrefix}-tok-${match.index}`));
    lastIndex = match.index + token.length;
  }

  if (lastIndex < code.length) {
    parts.push(span(code.slice(lastIndex), tone.plain, `${keyPrefix}-rest`));
  }

  return parts.length > 0 ? parts : highlightPlain(code, keyPrefix);
}

function highlightShell(code: string, keyPrefix: string) {
  return highlightJsLike(code, keyPrefix, false);
}

export function SourceHighlight({ value, language = "text" }: { value: string; language?: string }) {
  const normalized = normalizeSourceLanguage(language);

  if (normalized === "json") {
    return <>{highlightJson(value, "source")}</>;
  }
  if (normalized === "css") {
    return <>{highlightCss(value, "source")}</>;
  }
  if (normalized === "bash" || normalized === "sh" || normalized === "shell") {
    return <>{highlightShell(value, "source")}</>;
  }
  if (normalized === "tsx" || normalized === "jsx") {
    return <>{highlightJsLike(value, "source", true)}</>;
  }
  if (normalized === "ts" || normalized === "typescript" || normalized === "js" || normalized === "javascript") {
    return <>{highlightJsLike(value, "source", false)}</>;
  }

  return <>{highlightPlain(value, "source")}</>;
}
