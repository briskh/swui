import { Navigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { CONVENTION_PAGES, getConventionMarkdown, type ConventionSlug } from "../lib/portal-content";

export function ConventionPage() {
  const { slug } = useParams();
  const page = CONVENTION_PAGES.find((entry) => entry.slug === slug);
  if (!page) {
    return <Navigate to="/" replace />;
  }
  const markdown = getConventionMarkdown(page.slug as ConventionSlug);
  if (!markdown) {
    return <p className="text-destructive">Missing synced document for {page.file}. Run sync-docs.</p>;
  }
  return (
    <article className="portal-markdown">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </article>
  );
}
