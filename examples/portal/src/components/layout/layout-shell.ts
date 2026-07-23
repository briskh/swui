/** Portal shell geometry — aligned with WideScreenGate (≤820 compact / ≥821 wide). */

export const shellCompactMaxClassName = "max-[820px]";

export const shellWideMinClassName = "min-[821px]";

/** Top bar height — 48px (`h-12`). */
export const shellTopBarHeightClassName = "h-12";

export const shellChromeHeaderClassName =
  "sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75";

export const shellHorizontalInsetClassName = "px-12 max-[820px]:px-6";

export const centeredPageClassName = "mx-auto w-full min-w-0 max-w-6xl";

export const shellMainClassName = `w-full py-8 ${shellHorizontalInsetClassName} max-[820px]:py-5`;
