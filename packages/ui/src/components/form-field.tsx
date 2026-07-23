import * as React from "react";
import { cn } from "../lib/utils";
import { Checkbox } from "./checkbox";
import { Label } from "./label";

export type FormFieldProps = {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
  hint?: string;
};

export function FormField({ label, htmlFor, children, className, hint }: FormFieldProps) {
  const generatedId = React.useId();
  const childId = React.isValidElement(children) ? (children.props as { id?: string }).id : undefined;
  const fieldId = htmlFor ?? childId ?? generatedId;

  const control =
    React.isValidElement(children) && htmlFor === undefined
      ? React.cloneElement(children as React.ReactElement<{ id?: string }>, {
          id: childId ?? fieldId
        })
      : children;

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={fieldId}>{label}</Label>
      {control}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export type FormActionsProps = {
  children: React.ReactNode;
  className?: string;
};

export function FormActions({ children, className }: FormActionsProps) {
  return <div className={cn("mt-5 flex items-center justify-end gap-2", className)}>{children}</div>;
}

export type FieldsetProps = {
  legend: string;
  children: React.ReactNode;
  className?: string;
};

export function Fieldset({ legend, children, className }: FieldsetProps) {
  return (
    <fieldset className={className}>
      <legend className="text-sm font-medium text-foreground">{legend}</legend>
      <div className="mt-2 grid gap-2">{children}</div>
    </fieldset>
  );
}

export type CheckboxFieldProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export function CheckboxField({ label, checked, onChange, disabled }: CheckboxFieldProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-foreground">
      <Checkbox checked={checked} onCheckedChange={onChange} disabled={disabled} />
      {label}
    </label>
  );
}
