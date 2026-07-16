import {
  endOfDay,
  format,
  startOfDay,
  subDays
} from "date-fns";

/** Canonical UTC instant for a calendar day chosen in the local timezone. */
export function localCalendarDayToUtcIso(day: Date): string {
  const year = day.getFullYear();
  const month = day.getMonth();
  const date = day.getDate();
  return new Date(Date.UTC(year, month, date)).toISOString();
}

/** Display a UTC instant in the viewer's local timezone. */
export function formatUtcInstantForLocalDisplay(utcIso: string, pattern = "PPP p"): string {
  return format(new Date(utcIso), pattern);
}

export type DateRangePreset = "today" | "7d" | "30d";

export const DATE_RANGE_PRESET_LABELS: Record<DateRangePreset, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days"
};

export type UtcDateRange = {
  fromUtc: string;
  toUtc: string;
};

/** Demo filter ranges: UTC ISO instants with inclusive local-day boundaries. */
export function getUtcRangeForPreset(preset: DateRangePreset, now = new Date()): UtcDateRange {
  const to = endOfDay(now);
  const from =
    preset === "today"
      ? startOfDay(now)
      : preset === "7d"
        ? startOfDay(subDays(now, 6))
        : startOfDay(subDays(now, 29));

  return {
    fromUtc: from.toISOString(),
    toUtc: to.toISOString()
  };
}
