import type { Components } from "react-markdown";
import { type ReactNode } from "react";
import remarkGfm from "remark-gfm";
import {
  SourceCode,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tty,
  TtyLine,
  slugifyHeading,
  type TableOfContentsItem
} from "@swqt/ui";

export const portalMarkdownRemarkPlugins = [remarkGfm];

const SHELL_LANGUAGES = new Set(["bash", "sh", "shell", "zsh", "console"]);

export function extractMarkdownHeadings(markdown: string): TableOfContentsItem[] {
  const items: TableOfContentsItem[] = [];
  const used = new Map<string, number>();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const title = match[2].replace(/\s+#+$/, "").trim();
    items.push({
      id: slugifyHeading(title, used),
      title,
      level
    });
  }

  return items;
}

function extractCodeBlockValue(children: ReactNode) {
  if (typeof children === "string") {
    return children.replace(/\n$/, "");
  }

  if (Array.isArray(children)) {
    return children
      .map((child) => (typeof child === "string" ? child : ""))
      .join("")
      .replace(/\n$/, "");
  }

  return String(children).replace(/\n$/, "");
}

function inferLanguage(className?: string) {
  const match = /language-([\w-]+)/.exec(className ?? "");
  return match?.[1]?.toLowerCase() ?? "text";
}

function normalizeShellBlock(value: string) {
  return value.trim();
}

function isSingleShellLine(value: string) {
  return value.split("\n").filter((line) => line.trim().length > 0).length <= 1;
}

function renderMarkdownCodeBlock(language: string, value: string) {
  const normalized = normalizeShellBlock(value);
  if (SHELL_LANGUAGES.has(language)) {
    return isSingleShellLine(normalized) ? <TtyLine value={normalized} /> : <Tty value={normalized} />;
  }

  return <SourceCode language={language} value={normalized} />;
}

function markdownTableComponents(): Partial<Components> {
  return {
    table({ children }) {
      return <Table className="my-4">{children}</Table>;
    },
    thead({ children }) {
      return <TableHeader>{children}</TableHeader>;
    },
    tbody({ children }) {
      return <TableBody>{children}</TableBody>;
    },
    tr({ children }) {
      return <TableRow>{children}</TableRow>;
    },
    th({ children }) {
      return <TableHead>{children}</TableHead>;
    },
    td({ children }) {
      return <TableCell>{children}</TableCell>;
    }
  };
}

export function createMarkdownComponents(headings: TableOfContentsItem[]): Partial<Components> {
  let cursor = 0;

  const renderHeading = (Tag: "h2" | "h3", level: 2 | 3) =>
    function MarkdownHeading({ children }: { children?: ReactNode }) {
      while (cursor < headings.length && headings[cursor]?.level !== level) {
        cursor += 1;
      }
      const item = headings[cursor];
      cursor += 1;
      const id = item?.id ?? slugifyHeading(String(children));

      return (
        <Tag id={id} className="scroll-mt-24">
          {children}
        </Tag>
      );
    };

  return {
    h2: renderHeading("h2", 2),
    h3: renderHeading("h3", 3),
    ul({ children }) {
      return <ul className="my-3 list-disc space-y-1 pl-5">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="my-3 list-decimal space-y-1 pl-5">{children}</ol>;
    },
    ...markdownTableComponents(),
    pre({ children }) {
      return <>{children}</>;
    },
    code({ className, children, node: _node, ...props }) {
      const isBlock = /language-/.test(className ?? "");
      if (isBlock) {
        const language = inferLanguage(className);
        const value = extractCodeBlockValue(children);
        return renderMarkdownCodeBlock(language, value);
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };
}

/** @deprecated Use createMarkdownComponents */
export const createMarkdownHeadingComponents = createMarkdownComponents;
