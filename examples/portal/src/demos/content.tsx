import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbTrail,
  Button,
  Calendar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Checkbox,
  Chip,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Combobox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  DataTable,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
  EmptyState,
  Field,
  FieldDescription,
  FieldLabel,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  InlineLoading,
  InlineNotice,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Label,
  LoadingButtonContent,
  LoadingState,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Popover,
  PopoverContent,
  PopoverSelect,
  PopoverTrigger,
  Progress,
  ProgressBlock,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  ServerDataTable,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  Skeleton,
  SkeletonStack,
  Slider,
  Spinner,
  StaleDataRefresh,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  ThemeControl,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  WideScreenGate,
  WideScreenPlaceholder,
  cn,
  notifyAction,
  notifyError,
  notifyPersistent,
  notifySuccess
} from "@swui/ui";
import { CheckboxField, Fieldset, FormActions, FormField } from "@swui/ui/form-field";
import { Form, FormControl, FormField as HookFormField, FormItem, FormLabel } from "@swui/ui/form";
import { formatUtcInstantForLocalDisplay, localCalendarDayToUtcIso } from "@swui/ui/date";
import type { ColumnDef } from "@tanstack/react-table";
import { DemoSection, DemoStack, DocumentedException } from "./helpers";

const tableRows = [
  { id: "1", name: "Alpha", status: "Ready" },
  { id: "2", name: "Beta", status: "Loading" }
];

const chartData = [
  { month: "Jan", value: 12 },
  { month: "Feb", value: 18 }
];

function OverlayDemo({
  title,
  triggerLabel,
  children
}: {
  title: string;
  triggerLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Representative portal demo state.</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export const componentDemos: Record<string, React.ComponentType> = {
  Button: () => (
    <DemoStack>
      <DemoSection title="Variants">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="passkey">Passkey</Button>
      </DemoSection>
      <DemoSection title="Sizes">
        <Button size="compact">Compact</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Add">
          +
        </Button>
      </DemoSection>
    </DemoStack>
  ),
  Label: () => (
    <div className="grid max-w-sm gap-2">
      <Label htmlFor="portal-label">Email</Label>
      <Input id="portal-label" placeholder="you@example.com" />
    </div>
  ),
  Input: () => <Input aria-label="Sample input" placeholder="Search components" className="max-w-sm" />,
  Textarea: () => <Textarea aria-label="Sample textarea" placeholder="Notes" className="max-w-md" />,
  FormField: () => (
    <FormField label="Username" hint="Visible to maintainers only.">
      <Input />
    </FormField>
  ),
  FormActions: () => (
    <div className="rounded-md border border-border p-4">
      <p className="text-sm text-muted-foreground">Form body</p>
      <FormActions>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </FormActions>
    </div>
  ),
  Fieldset: () => (
    <Fieldset legend="Notifications">
      <CheckboxField label="Email alerts" checked onChange={() => undefined} />
      <CheckboxField label="Weekly digest" checked={false} onChange={() => undefined} />
    </Fieldset>
  ),
  CheckboxField: () => <CheckboxField label="Remember device" checked onChange={() => undefined} />,
  Select: () => (
    <Select defaultValue="ready">
      <SelectTrigger aria-label="Status" className="max-w-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ready">Ready</SelectItem>
        <SelectItem value="loading">Loading</SelectItem>
      </SelectContent>
    </Select>
  ),
  Checkbox: () => (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox defaultChecked /> Accept terms
    </label>
  ),
  Switch: () => (
    <label className="flex items-center gap-2 text-sm">
      <Switch defaultChecked aria-label="Enable feature" /> Enabled
    </label>
  ),
  RadioGroup: () => (
    <RadioGroup defaultValue="a" className="grid gap-2">
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="a" /> Option A
      </label>
      <label className="flex items-center gap-2 text-sm">
        <RadioGroupItem value="b" /> Option B
      </label>
    </RadioGroup>
  ),
  Slider: () => <Slider defaultValue={[40]} max={100} step={1} aria-label="Volume" className="max-w-xs" />,
  Field: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="field-demo">API key</FieldLabel>
      <Input id="field-demo" />
      <FieldDescription>Rotates automatically every 90 days.</FieldDescription>
    </Field>
  ),
  Form: () => {
    const form = useForm({ defaultValues: { name: "Skywalker" } });
    return (
      <Form {...form}>
        <form className="grid max-w-sm gap-4" onSubmit={form.handleSubmit(() => undefined)}>
          <HookFormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
  Combobox: () => {
    const [value, setValue] = useState("alpha");
    const options = [
      { value: "alpha", label: "Alpha" },
      { value: "beta", label: "Beta" }
    ];
    return <Combobox value={value} onValueChange={setValue} options={options} placeholder="Pick one" aria-label="Combobox" />;
  },
  Command: () => (
    <Command className="max-w-sm rounded-md border">
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Button</CommandItem>
          <CommandItem>Input</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
  InputGroup: () => (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>https://</InputGroupAddon>
      <InputGroupInput aria-label="Domain" placeholder="ui.swqt.net" />
    </InputGroup>
  ),
  Calendar: () => <Calendar mode="single" selected={new Date()} className="rounded-md border" />,
  DatePicker: () => {
    const [valueUtc, setValueUtc] = useState<string | undefined>(() => localCalendarDayToUtcIso(new Date()));
    return (
      <DatePicker
        valueUtc={valueUtc}
        onValueUtcChange={(next) => setValueUtc(next)}
        id="portal-date-picker"
      />
    );
  },
  Alert: () => (
    <DemoStack>
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Default alert copy.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Saved successfully.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Check peer dependencies.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Install failed.</AlertDescription>
      </Alert>
    </DemoStack>
  ),
  Badge: () => (
    <DemoSection title="Variants">
      <Badge>Default</Badge>
      <Badge variant="ready">Ready</Badge>
      <Badge variant="loading">Loading</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </DemoSection>
  ),
  Chip: () => (
    <DemoSection title="Variants">
      <Chip>@swui/ui</Chip>
      <Chip variant="outline">1.0.0</Chip>
    </DemoSection>
  ),
  InlineNotice: () => <InlineNotice>Synced from SSOT</InlineNotice>,
  EmptyState: () => <EmptyState>No packages matched your filter.</EmptyState>,
  LoadingState: () => <LoadingState label="Loading catalog" />,
  Skeleton: () => <Skeleton className="h-10 w-48" />,
  Spinner: () => <Spinner aria-label="Loading demo" />,
  Progress: () => <Progress value={45} aria-label="Upload progress" className="max-w-sm" />,
  Empty: () => (
    <Empty variant="zero-data">
      <EmptyHeader>
        <EmptyTitle>No components</EmptyTitle>
        <EmptyDescription>Try another filter.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
  Toaster: () => (
    <>
      <Toaster />
      <Button variant="outline" onClick={() => notifySuccess("Toast from portal demo")}>
        Show toast
      </Button>
    </>
  ),
  toastPolicy: () => (
    <DocumentedException>
      <code>toastPolicy</code> is a configuration object consumed by Sonner helpers; use the notify* demos or mount{" "}
      <code>Toaster</code> in the app shell.
    </DocumentedException>
  ),
  notifySuccess: () => (
    <>
      <Toaster />
      <Button onClick={() => notifySuccess("Saved")}>notifySuccess</Button>
    </>
  ),
  notifyError: () => (
    <>
      <Toaster />
      <Button variant="destructive" onClick={() => notifyError("Failed")}>
        notifyError
      </Button>
    </>
  ),
  notifyAction: () => (
    <>
      <Toaster />
      <Button
        variant="outline"
        onClick={() =>
          notifyAction("Retry sync", {
            action: { label: "Retry", onClick: () => undefined }
          })
        }
      >
        notifyAction
      </Button>
    </>
  ),
  notifyPersistent: () => (
    <>
      <Toaster />
      <Button variant="secondary" onClick={() => notifyPersistent("Deploy in progress")}>
        notifyPersistent
      </Button>
    </>
  ),
  InlineLoading: () => <InlineLoading>Refreshing registry</InlineLoading>,
  LoadingButtonContent: () => (
    <Button disabled>
      <LoadingButtonContent>Saving</LoadingButtonContent>
    </Button>
  ),
  SkeletonStack: () => <SkeletonStack />,
  StaleDataRefresh: () => <StaleDataRefresh label="Registry cache is stale." detail="Showing last synced metadata." />,
  ProgressBlock: () => <ProgressBlock value={60} label="Publishing packages" status="In progress" />,
  Card: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <p className="text-sm text-muted-foreground">Supporting copy for the panel.</p>
      </CardHeader>
      <CardContent>Card body content.</CardContent>
      <div className="flex justify-end gap-2 border-t px-4 py-3">
        <Button variant="outline">Cancel</Button>
        <Button>Confirm</Button>
      </div>
    </Card>
  ),
  Table: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  DataTable: () => {
    const columns = useMemo<ColumnDef<(typeof tableRows)[number]>[]>(
      () => [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "status", header: "Status" }
      ],
      []
    );
    return (
      <WideScreenGate title="DataTable" description="Widen the viewport to preview the table demo.">
        <DataTable columns={columns} data={tableRows} />
      </WideScreenGate>
    );
  },
  ServerDataTable: () => (
    <WideScreenGate title="ServerDataTable" description="Widen the viewport to preview the server table demo.">
      <ServerDataTable
        columns={[
          { id: "name", header: "Name", cell: (row) => row.name },
          { id: "status", header: "Status", cell: (row) => row.status }
        ]}
        rows={tableRows}
        getRowId={(row) => row.id}
        emptyMessage="No rows"
      />
    </WideScreenGate>
  ),
  PopoverSelect: () => (
    <PopoverSelect
      aria-label="Status filter"
      value="all"
      onValueChange={() => undefined}
      options={[
        { value: "all", label: "All" },
        { value: "ready", label: "Ready" }
      ]}
    />
  ),
  Separator: () => (
    <div className="flex max-w-sm items-center gap-3 text-sm">
      <span>Left</span>
      <Separator orientation="vertical" className="h-4" />
      <span>Right</span>
    </div>
  ),
  ScrollArea: () => (
    <ScrollArea className="h-24 w-48 rounded-md border p-3">
      <div className="grid gap-2 text-sm">
        {Array.from({ length: 8 }, (_, index) => (
          <p key={index}>Row {index + 1}</p>
        ))}
      </div>
    </ScrollArea>
  ),
  Pagination: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
  Accordion: () => (
    <Accordion type="single" collapsible className="max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is @swui/ui?</AccordionTrigger>
        <AccordionContent>Shared React primitives for Skywalker apps.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  Collapsible: () => (
    <Collapsible defaultOpen className="max-w-md">
      <CollapsibleTrigger asChild>
        <Button variant="outline">Toggle details</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 text-sm text-muted-foreground">Extra catalog notes.</CollapsibleContent>
    </Collapsible>
  ),
  Avatar: () => (
    <Avatar>
      <AvatarFallback>SW</AvatarFallback>
    </Avatar>
  ),
  Dialog: () => (
    <OverlayDemo title="Dialog" triggerLabel="Open dialog">
      <p className="text-sm text-muted-foreground">Dialog body content.</p>
    </OverlayDemo>
  ),
  AlertDialog: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  Sheet: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Sheet title</SheetTitle>
          <SheetDescription>Drawer-style overlay.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
  DropdownMenu: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  ContextMenu: () => (
    <ContextMenu>
      <ContextMenuTrigger className="rounded-md border border-dashed px-6 py-8 text-sm text-muted-foreground">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  Tooltip: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  ),
  Popover: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="text-sm">Popover content</PopoverContent>
    </Popover>
  ),
  HoverCard: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@swui/ui</Button>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm">Design system package overview.</HoverCardContent>
    </HoverCard>
  ),
  Tabs: () => (
    <Tabs defaultValue="docs" className="max-w-md">
      <TabsList>
        <TabsTrigger value="docs">Docs</TabsTrigger>
        <TabsTrigger value="packages">Packages</TabsTrigger>
      </TabsList>
      <TabsContent value="docs" className="text-sm text-muted-foreground">
        Convention pages synced from SSOT.
      </TabsContent>
      <TabsContent value="packages" className="text-sm text-muted-foreground">
        Registry metadata and install commands.
      </TabsContent>
    </Tabs>
  ),
  Breadcrumb: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  BreadcrumbTrail: () => (
    <BreadcrumbTrail
      items={[
        { label: "Portal", href: "/" },
        { label: "Components", href: "/components" },
        { label: "Button" }
      ]}
    />
  ),
  Toggle: () => (
    <Toggle aria-label="Toggle bold" defaultPressed>
      Bold
    </Toggle>
  ),
  ToggleGroup: () => (
    <ToggleGroup type="single" defaultValue="left" aria-label="Alignment">
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  ),
  Sidebar: () => (
    <SidebarProvider>
      <Sidebar className="relative h-48 w-full max-w-md rounded-md border">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Catalog</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Button</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Input</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
  ChartContainer: () => (
    <ChartContainer
      className="h-48 w-full max-w-md"
      config={{ value: { label: "Value", color: "var(--metric-instrument)" } }}
    >
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="month" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="value" stroke="var(--color-instrument)" strokeWidth={2} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  ),
  ChartTooltipContent: () => (
    <DocumentedException>
      Use inside <code>ChartContainer</code> via <code>ChartTooltip content=&#123;&lt;ChartTooltipContent /&gt;&#125;</code>.
    </DocumentedException>
  ),
  ChartLegendContent: () => (
    <DocumentedException>
      Render with <code>ChartLegend content=&#123;&lt;ChartLegendContent /&gt;&#125;</code> inside a chart container.
    </DocumentedException>
  ),
  ThemeProvider: () => (
    <DocumentedException>
      The portal layout already mounts <code>ThemeProvider</code>; use <code>ThemeControl</code> to inspect theme switching.
    </DocumentedException>
  ),
  useTheme: () => (
    <DocumentedException>
      Hook-only export. Theme state is exercised globally via <code>ThemeControl</code> in the portal header.
    </DocumentedException>
  ),
  ThemeControl: () => <ThemeControl />,
  Theme: () => (
    <DocumentedException>
      <code>Theme</code> is a TypeScript type alias for effective light/dark rendering, not a visual component.
    </DocumentedException>
  ),
  cn: () => (
    <p className={cn("rounded-md border px-3 py-2 text-sm", "border-primary text-primary")}>
      cn merged utility classes
    </p>
  ),
  DateHelpers: () => {
    const iso = localCalendarDayToUtcIso(new Date());
    return (
      <div className="grid max-w-md gap-2 text-sm">
        <p>
          <span className="font-medium">localCalendarDayToUtcIso:</span> {iso}
        </p>
        <p>
          <span className="font-medium">formatUtcInstantForLocalDisplay:</span> {formatUtcInstantForLocalDisplay(iso)}
        </p>
      </div>
    );
  },
  WideScreenGate: () => (
    <WideScreenGate title="Wide screen required" description="Compact viewports see this placeholder.">
      <p className="text-sm">Dense content visible on wide screens.</p>
    </WideScreenGate>
  ),
  WideScreenPlaceholder: () => <WideScreenPlaceholder title="Use a wider screen" description="Representative placeholder." />
};

export const documentedExceptions = new Set(["toastPolicy", "ThemeProvider", "useTheme", "Theme", "ChartTooltipContent", "ChartLegendContent"]);

export function getComponentDemo(name: string) {
  return componentDemos[name] ?? null;
}
