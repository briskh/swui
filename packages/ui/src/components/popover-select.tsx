import * as React from "react";
import { cn } from "../lib/utils";

export type PopoverSelectOption = {
  value: string;
  label: string;
};

export type PopoverSelectProps = Omit<
  React.ComponentPropsWithoutRef<"select">,
  "children" | "defaultValue" | "onChange" | "value"
> & {
  id?: string;
  value: string;
  options: PopoverSelectOption[];
  onValueChange: (value: string) => void;
  placeholder?: string;
  /** @deprecated Applied to the native select for migrate-forward compatibility. */
  contentClassName?: string;
  /** Applied to each native option. Browser styling support varies. */
  itemClassName?: string;
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
  ...props
}: PopoverSelectProps) {
  const hasSelectedOption = options.some((option) => option.value === value);

  return (
    <select
      id={id}
      value={hasSelectedOption ? value : ""}
      className={cn(
        "h-control-md w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
        contentClassName
      )}
      onChange={(event) => onValueChange(event.currentTarget.value)}
      {...props}
    >
      {!hasSelectedOption ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => (
        <option key={option.value} value={option.value} className={itemClassName}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
