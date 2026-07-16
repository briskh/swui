import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button";

export type CalendarProps = DayPickerProps;

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
        month_caption: cn("relative flex h-9 items-center justify-center", defaults.month_caption),
        caption_label: cn("text-sm font-medium", defaults.caption_label),
        nav: cn("flex items-center gap-1", defaults.nav),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100",
          defaults.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100",
          defaults.button_next
        ),
        month_grid: cn("w-full border-collapse", defaults.month_grid),
        weekdays: cn("flex", defaults.weekdays),
        weekday: cn("w-9 text-center text-[0.8rem] font-normal text-muted-foreground", defaults.weekday),
        week: cn("mt-2 flex w-full", defaults.week),
        day: cn(
          "relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          defaults.day
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-normal aria-selected:opacity-100",
          defaults.day_button
        ),
        selected: cn("bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground", defaults.selected),
        today: cn("bg-accent text-accent-foreground", defaults.today),
        outside: cn("text-muted-foreground opacity-50 aria-selected:bg-accent/50", defaults.outside),
        disabled: cn("text-muted-foreground opacity-50", defaults.disabled),
        range_middle: cn("aria-selected:bg-accent aria-selected:text-accent-foreground", defaults.range_middle),
        hidden: cn("invisible", defaults.hidden),
        ...classNames
      }}
      components={{
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
