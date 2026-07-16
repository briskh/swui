import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import { useTheme } from "../theme";

export const toastPolicy = {
  position: "bottom-right",
  duration: 4000,
  visibleToasts: 4,
  expand: false,
  richColors: true,
  closeButton: true
} as const;

type ToastOptions = NonNullable<Parameters<typeof toast>[1]>;

export function notifySuccess(message: string, options?: ToastOptions) {
  return toast.success(message, { duration: toastPolicy.duration, ...options });
}

export function notifyError(message: string, options?: ToastOptions) {
  return toast.error(message, { duration: toastPolicy.duration, ...options });
}

export function notifyAction(message: string, options: ToastOptions) {
  return toast(message, { duration: toastPolicy.duration, ...options });
}

export function notifyPersistent(message: string, options?: ToastOptions) {
  return toast(message, { duration: Number.POSITIVE_INFINITY, ...options });
}

export function Toaster(props: ToasterProps) {
  const { theme } = useTheme();
  const { toastOptions, ...rest } = props;
  const defaultToastOptions: NonNullable<ToasterProps["toastOptions"]> = {
    classNames: {
      toast:
        "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
      description: "group-[.toast]:text-muted-foreground",
      actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
      cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
    }
  };

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position={toastPolicy.position}
      duration={toastPolicy.duration}
      visibleToasts={toastPolicy.visibleToasts}
      expand={toastPolicy.expand}
      richColors={toastPolicy.richColors}
      closeButton={toastPolicy.closeButton}
      toastOptions={{
        ...defaultToastOptions,
        ...toastOptions,
        classNames: {
          ...defaultToastOptions.classNames,
          ...toastOptions?.classNames
        }
      }}
      {...rest}
    />
  );
}
