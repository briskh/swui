import * as React from "react";

const tone = {
  prompt: "text-[color:var(--tty-prompt)]",
  command: "text-[color:var(--tty-command)] font-medium",
  flag: "text-[color:var(--tty-flag)]",
  string: "text-[color:var(--tty-string)]",
  path: "text-[color:var(--tty-path)]",
  success: "text-[color:var(--tty-success)]",
  error: "text-[color:var(--tty-error)]",
  muted: "text-[color:var(--tty-muted)]",
  text: "text-[color:var(--tty-foreground)]"
} as const;

function span(text: string, className: string, key: string) {
  return (
    <span key={key} className={className}>
      {text}
    </span>
  );
}

function highlightByPattern(line: string, pattern: RegExp, className: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push(span(line.slice(lastIndex, index), tone.text, `${keyPrefix}-t-${lastIndex}`));
    }
    parts.push(span(match[0], className, `${keyPrefix}-m-${index}`));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < line.length) {
    parts.push(span(line.slice(lastIndex), tone.text, `${keyPrefix}-t-${lastIndex}`));
  }
  return parts.length > 0 ? parts : [span(line, tone.text, `${keyPrefix}-full`)];
}

function tokenizePromptTail(tail: string, keyPrefix: string) {
  const parts: React.ReactNode[] = [];
  const pattern = /("[^"]*"|'[^']*'|\S+)/g;
  let match: RegExpExecArray | null;
  let isCommand = true;
  let cursor = 0;

  while ((match = pattern.exec(tail)) !== null) {
    if (match.index > cursor) {
      parts.push(span(tail.slice(cursor, match.index), tone.text, `${keyPrefix}-gap-${cursor}`));
    }

    const token = match[0];
    let className: string = tone.text;
    if (isCommand) {
      className = tone.command;
      isCommand = false;
    } else if (token.startsWith("-")) {
      className = tone.flag;
    } else if (token.startsWith('"') || token.startsWith("'")) {
      className = tone.string;
    } else if (/[\\/]/.test(token)) {
      className = tone.path;
    }

    parts.push(span(token, className, `${keyPrefix}-tok-${match.index}`));
    cursor = match.index + token.length;
  }

  if (cursor < tail.length) {
    parts.push(span(tail.slice(cursor), tone.text, `${keyPrefix}-rest`));
  }

  return parts;
}

const PROMPT_LINE = /^(\s*)[$#](\s+)(.*)$/;

/** Remove `$` / `#` prompts from copy text while preserving command tails and output lines. */
export function stripShellPrompts(text: string) {
  return text
    .split("\n")
    .map((line) => {
      const match = line.match(PROMPT_LINE);
      if (!match) {
        return line;
      }
      const [, indent, , tail] = match;
      return `${indent}${tail}`;
    })
    .join("\n");
}

function highlightPromptLine(line: string, keyPrefix: string) {
  const match = line.match(/^(\s*)([$#])(\s+)([\s\S]*)$/);
  if (!match) {
    return span(line, tone.text, `${keyPrefix}-plain`);
  }

  const [, indent, sigil, spacing, tail] = match;
  return (
    <>
      {indent ? span(indent, tone.text, `${keyPrefix}-indent`) : null}
      {span(`${sigil}${spacing}`, tone.prompt, `${keyPrefix}-prompt`)}
      {tokenizePromptTail(tail, `${keyPrefix}-cmd`)}
    </>
  );
}

function highlightOutputLine(line: string, keyPrefix: string) {
  if (!line.trim()) {
    return null;
  }

  const errorPattern = /\b(error|failed|fatal|denied|cannot|missing)\b/gi;
  const successPattern = /\b(passed|success|complete|succeeded|ready)\b/gi;

  if (errorPattern.test(line)) {
    errorPattern.lastIndex = 0;
    return highlightByPattern(line, errorPattern, tone.error, `${keyPrefix}-error`);
  }

  if (successPattern.test(line)) {
    successPattern.lastIndex = 0;
    return highlightByPattern(line, successPattern, tone.success, `${keyPrefix}-success`);
  }

  if (/^\s*(at |→ |> )/.test(line)) {
    return span(line, tone.muted, `${keyPrefix}-trace`);
  }

  return span(line, tone.text, `${keyPrefix}-text`);
}

/** Lightweight shell / log highlighter for `Tty` (prompt, flags, paths, status words). */
export function ShellHighlight({ value }: { value: string }) {
  const lines = value.split("\n");

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {index > 0 ? "\n" : null}
          {/^\s*[$#]/.test(line) ? highlightPromptLine(line, `line-${index}`) : highlightOutputLine(line, `line-${index}`)}
        </React.Fragment>
      ))}
    </>
  );
}
