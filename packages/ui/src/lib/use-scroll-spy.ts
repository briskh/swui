import * as React from "react";

export type UseScrollSpyOptions = {
  ids: string[];
  root?: Element | null;
  offset?: number;
  enabled?: boolean;
};

/** Tracks which section id is active while scrolling the window or a scroll container. */
export function useScrollSpy({ ids, root = null, offset = 96, enabled = true }: UseScrollSpyOptions) {
  const idKey = ids.join("|");
  const [activeId, setActiveId] = React.useState<string | null>(ids[0] ?? null);

  React.useEffect(() => {
    if (!enabled || ids.length === 0) {
      return;
    }

    const resolveElements = () =>
      ids.map((id) => document.getElementById(id)).filter((element): element is HTMLElement => element != null);

    const update = () => {
      const elements = resolveElements();
      if (elements.length === 0) {
        return;
      }

      const rootTop = root instanceof Element ? root.getBoundingClientRect().top : 0;
      const threshold = rootTop + offset;

      let current = elements[0]?.id ?? null;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= threshold) {
          current = element.id;
        }
      }
      setActiveId(current);
    };

    update();
    const scrollTarget = root ?? window;
    scrollTarget.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      scrollTarget.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled, idKey, offset, root]);

  return activeId;
}
