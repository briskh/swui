const NON_SLUG = /[^\p{L}\p{N}]+/gu;

/** Stable slug for in-page anchors; appends `-2`, `-3`, … on collision. */
export function slugifyHeading(title: string, used = new Map<string, number>()) {
  const base =
    title
      .trim()
      .toLowerCase()
      .replace(NON_SLUG, "-")
      .replace(/^-+|-+$/g, "") || "section";

  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}
