import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandLoading } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loading?: boolean;
  shouldFilter?: boolean;
  debounceMs?: number;
  disabled?: boolean;
  id?: string;
  className?: string;
  compact?: boolean;
  mutedValues?: string[];
  itemClassName?: string;
  "aria-label"?: string;
};

export const defaultComboboxDebounceMs = 250;

export function Combobox({
  options,
  value: valueProp,
  defaultValue,
  onValueChange,
  onSearchChange,
  searchValue,
  placeholder = "Select option",
  searchPlaceholder = "Search options...",
  emptyMessage = "No option found.",
  loading = false,
  shouldFilter = true,
  debounceMs = defaultComboboxDebounceMs,
  disabled,
  id,
  className,
  compact = false,
  mutedValues,
  itemClassName,
  "aria-label": ariaLabel
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState(searchValue ?? "");
  const value = valueProp ?? uncontrolledValue;
  const commandSearch = searchValue ?? uncontrolledSearch;
  const selected = options.find((option) => option.value === value);
  const isMutedSelection = !selected || mutedValues?.includes(selected.value) === true;

  const selectValue = (nextValue: string) => {
    if (valueProp === undefined) {
      setUncontrolledValue(nextValue);
    }
    onValueChange?.(nextValue);
    setOpen(false);
  };

  const updateSearch = (nextSearch: string) => {
    if (searchValue === undefined) {
      setUncontrolledSearch(nextSearch);
    }
  };

  React.useEffect(() => {
    if (!onSearchChange) {
      return undefined;
    }
    const timeout = window.setTimeout(() => onSearchChange(commandSearch), debounceMs);
    return () => window.clearTimeout(timeout);
  }, [commandSearch, debounceMs, onSearchChange]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel}
          disabled={disabled}
          className={cn("w-full justify-between font-normal", compact && "gap-1 border-transparent bg-transparent shadow-none hover:bg-transparent", className)}
        >
          <span
            className={cn(
              "truncate",
              isMutedSelection ? "text-muted-foreground" : compact ? "text-primary" : undefined
            )}
          >
            {selected?.label ?? placeholder}
          </span>
          <ChevronsUpDown className={cn("shrink-0 opacity-70", compact ? "size-3" : "size-4")} aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command shouldFilter={shouldFilter}>
          <CommandInput value={commandSearch} onValueChange={updateSearch} placeholder={searchPlaceholder} aria-label={ariaLabel ?? placeholder} />
          <CommandList>
            {loading ? <CommandLoading>Loading options...</CommandLoading> : <CommandEmpty>{emptyMessage}</CommandEmpty>}
            <CommandGroup>
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    className={itemClassName}
                    onPointerDown={(event) => event.preventDefault()}
                    onSelect={() => selectValue(option.value)}
                  >
                    <Check className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
