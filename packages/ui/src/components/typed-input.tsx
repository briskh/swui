import { Eye, EyeOff, Search } from "lucide-react";
import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input, type InputProps } from "./input";

type TypedInputProps = Omit<InputProps, "type">;

function assignDisplayName<T>(component: T, name: string) {
  (component as React.FC).displayName = name;
  return component;
}

export const EmailInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, TypedInputProps>(({ autoComplete = "email", inputMode = "email", ...props }, ref) => (
    <Input ref={ref} type="email" autoComplete={autoComplete} inputMode={inputMode} spellCheck={false} {...props} />
  )),
  "EmailInput"
);

export const UrlInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, TypedInputProps>(({ autoComplete = "url", inputMode = "url", ...props }, ref) => (
    <Input ref={ref} type="url" autoComplete={autoComplete} inputMode={inputMode} spellCheck={false} {...props} />
  )),
  "UrlInput"
);

export const TelInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, TypedInputProps>(({ autoComplete = "tel", inputMode = "tel", ...props }, ref) => (
    <Input ref={ref} type="tel" autoComplete={autoComplete} inputMode={inputMode} {...props} />
  )),
  "TelInput"
);

export const NumberInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, TypedInputProps>(({ inputMode = "decimal", ...props }, ref) => (
    <Input ref={ref} type="number" inputMode={inputMode} {...props} />
  )),
  "NumberInput"
);

export type SearchInputProps = TypedInputProps;

export const SearchInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, SearchInputProps>(({ className, ...props }, ref) => (
    <div className={cn("relative w-full", className)}>
      <Input
        ref={ref}
        type="search"
        enterKeyHint="search"
        role="searchbox"
        className="pr-10"
        {...props}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 flex size-control-compact -translate-y-1/2 items-center justify-center text-muted-foreground"
      >
        <Search className="size-4" />
      </span>
    </div>
  )),
  "SearchInput"
);

export type PasswordInputProps = TypedInputProps & {
  defaultVisible?: boolean;
  showLabel?: string;
  hideLabel?: string;
};

export const PasswordInput = assignDisplayName(
  React.forwardRef<HTMLInputElement, PasswordInputProps>(
    (
      {
        className,
        defaultVisible = false,
        showLabel = "Show password",
        hideLabel = "Hide password",
        autoComplete = "current-password",
        ...props
      },
      ref
    ) => {
      const [visible, setVisible] = React.useState(defaultVisible);

      return (
        <div className={cn("relative w-full", className)}>
          <Input
            ref={ref}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            spellCheck={false}
            className="pr-10"
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-compact"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={visible ? hideLabel : showLabel}
            aria-pressed={visible}
            onClick={() => setVisible((current) => !current)}
          >
            {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
          </Button>
        </div>
      );
    }
  ),
  "PasswordInput"
);
