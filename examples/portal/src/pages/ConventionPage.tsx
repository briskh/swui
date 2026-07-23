import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Alert, AlertDescription, TableOfContentsLayout, TableOfContentsPanel } from "@swqt/ui";
import { CONVENTION_PAGES, getConventionMarkdown, type ConventionSlug } from "../lib/portal-content";
import { createMarkdownComponents, extractMarkdownHeadings, portalMarkdownRemarkPlugins } from "../lib/markdown-headings";

export function ConventionPage() {
  const { slug } = useParams();
  const page = CONVENTION_PAGES.find((entry) => entry.slug === slug);
  if (!page) {
    return <Navigate to="/" replace />;
  }
  const markdown = getConventionMarkdown(page.slug as ConventionSlug);
  if (!markdown) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Missing synced document for {page.file}. Run sync-docs.</AlertDescription>
      </Alert>
    );
  }

  const headings = useMemo(() => extractMarkdownHeadings(markdown), [markdown]);
  const markdownComponents = useMemo(() => createMarkdownComponents(headings), [headings]);

  return (
    <TableOfContentsLayout
      toc={
        <div data-testid="page-toc">
          <TableOfContentsPanel items={headings} />
        </div>
      }
      contentClassName="portal-markdown"
    >
      <article>
        <ReactMarkdown remarkPlugins={portalMarkdownRemarkPlugins} components={markdownComponents}>
          {markdown}
        </ReactMarkdown>
      </article>
    </TableOfContentsLayout>
  );
}
