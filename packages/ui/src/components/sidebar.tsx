import * as React from "react";
import { PanelLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Separator } from "./separator";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
};

export function SidebarProvider({ defaultOpen = true, className, style, children, ...props }: SidebarProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      toggleSidebar: () => setOpen((current) => !current)
    }),
    [open]
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        className={cn("group/sidebar-wrapper flex min-h-[280px] w-full", className)}
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style
          } as React.CSSProperties
        }
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ className, children, ...props }: React.ComponentProps<"aside">) {
  const { open } = useSidebar();

  return (
    <aside
      data-state={open ? "expanded" : "collapsed"}
      className={cn(
        "flex h-full shrink-0 flex-col border-r bg-card text-card-foreground transition-[width] duration-200",
        open ? "w-[var(--sidebar-width)]" : "w-[var(--sidebar-width-icon)]",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

export function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return <main className={cn("flex min-w-0 flex-1 flex-col gap-4 p-4", className)} {...props} />;
}

export function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-3", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-3", className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  const { open } = useSidebar();
  return <div className={cn("flex flex-1 flex-col gap-1 overflow-auto px-2 py-2", !open && "items-center", className)} {...props} />;
}

export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex w-full flex-col gap-1", className)} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: React.ComponentProps<"div">) {
  const { open } = useSidebar();
  if (!open) {
    return null;
  }
  return <div className={cn("px-2 py-1 text-xs font-semibold uppercase text-muted-foreground", className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul className={cn("flex flex-col gap-1", className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("list-none", className)} {...props} />;
}

export type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
  asChild?: boolean;
};

export function SidebarMenuButton({ className, isActive, asChild = false, ...props }: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : "button";
  const { open } = useSidebar();

  return (
    <Comp
      type={asChild ? undefined : "button"}
      data-active={isActive}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium transition-colors hover:bg-muted",
        isActive && "bg-accent text-accent-foreground",
        !open && "justify-center px-0",
        className
      )}
      {...props}
    />
  );
}

export function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button type="button" variant="outline" size="icon" className={className} onClick={toggleSidebar} aria-label="Toggle sidebar" {...props}>
      <PanelLeft aria-hidden="true" />
    </Button>
  );
}

export function SidebarSeparator() {
  return <Separator className="mx-2" />;
}
