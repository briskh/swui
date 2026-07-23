import { Fingerprint, Loader2 } from "lucide-react";
import * as React from "react";
import { Alert } from "./alert";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "./dialog";
import { FormActions } from "./form-field";
import { cn } from "../lib/utils";

export type PasskeyDialogProps = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  guidance?: React.ReactNode;
  guidanceVariant?: React.ComponentProps<typeof Alert>["variant"];
  error?: React.ReactNode;
  pending?: boolean;
  onVerify?: () => void;
  verifyLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/**
 * Passkey step-up dialog shell (eauth StepUpDialog parity).
 * Presentational only — wire WebAuthn / API flows in the host app via onVerify.
 */
export function PasskeyDialog({
  open,
  onOpenChange,
  onClose,
  title,
  description,
  guidance,
  guidanceVariant = "warning",
  error,
  pending = false,
  onVerify,
  verifyLabel = "Verify passkey",
  cancelLabel = "Cancel",
  children,
  className,
  contentClassName
}: PasskeyDialogProps) {
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
      if (!next) {
        onClose?.();
      }
    },
    [onClose, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("w-full max-h-[90vh] overflow-hidden sm:max-w-lg", className)}>
        <div className="grid gap-4">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle>{title}</DialogTitle>
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
          <div className={cn("max-h-[min(70vh,720px)] overflow-y-auto", contentClassName)}>
            <div className="grid gap-4">
              {guidance ? <Alert variant={guidanceVariant}>{guidance}</Alert> : null}
              {error ? <Alert variant="destructive">{error}</Alert> : null}
              {children}
            </div>
          </div>
          <DialogFooter className="border-t border-border pt-4 sm:justify-end">
            <FormActions className="mt-0">
              <Button type="button" variant="ghost" size="sm" onClick={() => handleOpenChange(false)} disabled={pending}>
                {cancelLabel}
              </Button>
              <Button type="button" variant="passkey" size="sm" onClick={onVerify} disabled={pending || !onVerify}>
                {pending ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Fingerprint aria-hidden="true" />}
                {verifyLabel}
              </Button>
            </FormActions>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
