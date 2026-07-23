import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayButton, DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

export type CalendarProps = DayPickerProps;

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaults = getDefaultClassNames();
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  const selectedSingle =
    modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle;
  const showToday =
    modifiers.today &&
    !modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.isoDate}
      data-selected-single={selectedSingle ? true : undefined}
      data-range-start={modifiers.range_start ? true : undefined}
      data-range-end={modifiers.range_end ? true : undefined}
      data-range-middle={modifiers.range_middle ? true : undefined}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "size-control-sm p-0 font-normal",
        showToday && "rounded-md bg-accent text-accent-foreground",
        "data-[selected-single=true]:rounded-md data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[selected-single=true]:hover:bg-primary data-[selected-single=true]:hover:text-primary-foreground",
        "data-[range-start=true]:rounded-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-start=true]:hover:bg-primary data-[range-start=true]:hover:text-primary-foreground",
        "data-[range-end=true]:rounded-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-end=true]:hover:bg-primary data-[range-end=true]:hover:text-primary-foreground",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-middle=true]:hover:bg-accent data-[range-middle=true]:hover:text-accent-foreground",
        modifiers.outside && "text-muted-foreground opacity-50",
        defaults.day_button,
        className
      )}
      {...props}
    />
  );
}

export function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  const defaults = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaults,
        root: cn("w-fit", defaults.root),
        months: cn("flex flex-col gap-4 sm:flex-row", defaults.months),
        month: cn("flex flex-col gap-4", defaults.month),
        month_caption: cn("relative flex h-control-sm items-center justify-center", defaults.month_caption),
        caption_label: cn("text-sm font-medium", defaults.caption_label),
        nav: cn("flex items-center gap-1", defaults.nav),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 size-control-xs bg-transparent p-0 opacity-70 hover:opacity-100",
          defaults.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 size-control-xs bg-transparent p-0 opacity-70 hover:opacity-100",
          defaults.button_next
        ),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn("w-control-sm text-center text-xs font-normal text-muted-foreground", defaults.weekday),
        week: cn("mt-2 flex w-full", defaults.week),
        day: cn(
          "group/day relative h-control-sm w-control-sm p-0 text-center text-sm focus-within:relative focus-within:z-20",
          defaults.day
        ),
        day_button: cn(defaults.day_button),
        selected: cn(defaults.selected),
        today: cn(defaults.today),
        outside: cn("text-muted-foreground opacity-50", defaults.outside),
        disabled: cn("text-muted-foreground opacity-50", defaults.disabled),
        range_middle: cn(defaults.range_middle),
        range_start: cn(defaults.range_start),
        range_end: cn(defaults.range_end),
        hidden: cn("invisible", defaults.hidden),
        ...classNames
      }}
      components={{
        DayButton: CalendarDayButton,
        Chevron: ({ orientation, className: chevronClassName, ...chevronProps }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight;
          return <Icon className={cn("size-4", chevronClassName)} {...chevronProps} />;
        }
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
