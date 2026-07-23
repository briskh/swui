import * as React from "react";
import { CalendarIcon } from "lucide-react";
import {
  DATE_RANGE_PRESET_LABELS,
  formatUtcInstantForLocalDisplay,
  getUtcRangeForPreset,
  localCalendarDayToUtcIso,
  type DateRangePreset,
  type UtcDateRange
} from "../lib/date";
import { cn } from "../lib/utils";
import { Button, buttonVariants } from "./button";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type DatePickerProps = {
  /** UTC ISO string for the selected calendar day. */
  valueUtc?: string;
  onValueUtcChange?: (utcIso: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function DatePicker({
  valueUtc,
  onValueUtcChange,
  placeholder = "Pick a date",
  disabled,
  className,
  id
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selected = valueUtc ? new Date(valueUtc) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn("w-full justify-start text-left font-normal", !valueUtc && "text-muted-foreground", className)}
        >
          <CalendarIcon aria-hidden="true" className="mr-2 size-4" />
          {valueUtc ? formatUtcInstantForLocalDisplay(valueUtc, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(day) => {
            if (!day) {
              onValueUtcChange?.(undefined);
              return;
            }
            onValueUtcChange?.(localCalendarDayToUtcIso(day));
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export type DateRangePresetPickerProps = {
  value?: DateRangePreset;
  onValueChange?: (preset: DateRangePreset, range: UtcDateRange) => void;
  className?: string;
};

export function DateRangePresetPicker({ value = "7d", onValueChange, className }: DateRangePresetPickerProps) {
  const presets: DateRangePreset[] = ["today", "7d", "30d"];
  const groupName = React.useId();

  return (
    <fieldset className={cn("flex flex-wrap gap-2 border-0 p-0", className)}>
      <legend className="sr-only">Date range presets</legend>
      {presets.map((preset) => {
        const selected = value === preset;

        return (
          <label key={preset} className="relative cursor-pointer">
            <input
              type="radio"
              name={groupName}
              value={preset}
              checked={selected}
              className="peer sr-only"
              onChange={() => onValueChange?.(preset, getUtcRangeForPreset(preset))}
            />
            <span
              className={buttonVariants({
                variant: selected ? "default" : "outline",
                className:
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
              })}
            >
              {DATE_RANGE_PRESET_LABELS[preset]}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export type UtcRangeReadoutProps = {
  fromUtc: string;
  toUtc: string;
  className?: string;
};

/** Fixture readout: persisted UTC values with local display labels. */
export function UtcRangeReadout({ fromUtc, toUtc, className }: UtcRangeReadoutProps) {
  return (
    <dl className={cn("grid gap-2 text-sm", className)}>
      <div className="grid gap-1">
        <dt className="font-medium text-muted-foreground">Stored (UTC)</dt>
        <dd className="break-all font-mono text-xs">
          {fromUtc} → {toUtc}
        </dd>
      </div>
      <div className="grid gap-1">
        <dt className="font-medium text-muted-foreground">Displayed (local)</dt>
        <dd>
          {formatUtcInstantForLocalDisplay(fromUtc)} — {formatUtcInstantForLocalDisplay(toUtc)}
        </dd>
      </div>
    </dl>
  );
}
