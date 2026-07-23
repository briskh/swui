export type ScrollToSectionOptions = {
  root?: Element | null;
  offset?: number;
  behavior?: ScrollBehavior;
};

/** Scrolls to a section id in the viewport or inside a scroll container. */
export function scrollToSection(id: string, { root = null, offset = 96, behavior = "smooth" }: ScrollToSectionOptions = {}) {
  const target = document.getElementById(id);
  if (!target) {
    return;
  }

  if (root instanceof HTMLElement) {
    const containerTop = root.getBoundingClientRect().top;
    const targetTop = target.getBoundingClientRect().top;
    root.scrollTo({
      top: root.scrollTop + targetTop - containerTop - offset,
      behavior
    });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior });
}
