import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

export type PopoverSelectOption = {
  value: string;
  label: string;
};

type PopoverSelectProps = {
  id?: string;
  value: string;
  options: PopoverSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  "aria-label"?: string;
};

export function PopoverSelect({
  id,
  value,
  options,
  onValueChange,
  placeholder = "Select option",
  disabled = false,
  className,
  contentClassName,
  itemClassName,
  "aria-label": ariaLabel
}: PopoverSelectProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((option) => option.value === value);

  const selectValue = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md border border-transparent bg-transparent text-left shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn("w-[var(--radix-popover-trigger-width)] p-1", contentClassName)}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div role="listbox" aria-label={ariaLabel} className="flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded py-1.5 pl-6 pr-2 text-left outline-none hover:bg-muted focus-visible:bg-muted focus-visible:text-foreground",
                  itemClassName
                )}
                onPointerDown={(event) => {
                  event.preventDefault();
                  selectValue(option.value);
                }}
              >
                <span className="absolute left-2 flex size-4 items-center justify-center">
                  <Check className={cn("size-4", isSelected ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
