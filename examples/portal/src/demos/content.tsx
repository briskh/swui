import { useMemo, useState, type ReactNode } from "react";
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
  CardFooter,
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
  CopyableText,
  DataTable,
  DatePicker,
  DateRangePresetPicker,
  DescriptionItem,
  DescriptionList,
  DescriptionSection,
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
  EmailInput,
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
  NumberInput,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PasskeyDialog,
  PasswordInput,
  Popover,
  PopoverContent,
  PopoverSelect,
  PopoverTrigger,
  Progress,
  ProgressBlock,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  SearchInput,
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
  SourceCode,
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
  TableOfContents,
  useScrollSpy,
  TabsContent,
  TabsList,
  TabsTrigger,
  TelInput,
  Textarea,
  ThemeControl,
  Toaster,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Tty,
  TtyLine,
  UrlInput,
  WideScreenGate,
  WideScreenPlaceholder,
  cn,
  notifyAction,
  notifyError,
  notifyPersistent,
  notifySuccess
} from "@swqt/ui";
import { CheckboxField, Fieldset, FormActions, FormField } from "@swqt/ui/form-field";
import { Form, FormControl, FormField as HookFormField, FormItem, FormLabel } from "@swqt/ui/form";
import { formatUtcInstantForLocalDisplay, localCalendarDayToUtcIso } from "@swqt/ui/date";
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

function CardCompositionExample({
  label,
  title,
  subtitle,
  actions = false,
  children = "Card body content."
}: {
  label: string;
  title?: string;
  subtitle?: string;
  actions?: boolean;
  children?: ReactNode;
}) {
  const showHeader = Boolean(title);

  return (
    <div className="grid gap-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Card>
        {showHeader ? (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </CardHeader>
        ) : null}
        <CardContent>{children}</CardContent>
        {actions ? (
          <CardFooter>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
            <Button size="sm">Confirm</Button>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}

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

function PasskeyDialogDemo() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open passkey dialog
      </Button>
      <PasskeyDialog
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
          setPending(false);
        }}
        title="Passkey verification required"
        description="Delete credential"
        guidance="Confirm with your passkey to continue this sensitive action."
        error={error}
        pending={pending}
        onVerify={() => {
          setPending(true);
          setError(null);
          window.setTimeout(() => {
            setPending(false);
            setOpen(false);
          }, 1200);
        }}
      />
    </>
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
        <Button>Default</Button>
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
      <EmailInput id="portal-label" placeholder="you@example.com" />
    </div>
  ),
  Input: () => (
    <DemoStack>
      <DemoSection title="Text">
        <Input aria-label="Sample input" placeholder="Plain text" className="max-w-sm" />
      </DemoSection>
      <DemoSection title="Typed inputs">
        <div className="grid w-full max-w-sm gap-4">
          <div className="grid gap-2">
            <Label htmlFor="demo-email">Email</Label>
            <EmailInput id="demo-email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-password">Password</Label>
            <PasswordInput id="demo-password" placeholder="Enter password" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-search">Search</Label>
            <SearchInput id="demo-search" className="max-w-sm" placeholder="Search components" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-url">URL</Label>
            <UrlInput id="demo-url" placeholder="https://ui.swqt.net" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-tel">Phone</Label>
            <TelInput id="demo-tel" placeholder="+1 555 0100" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="demo-number">Amount</Label>
            <NumberInput id="demo-number" placeholder="0.00" step="0.01" />
          </div>
        </div>
      </DemoSection>
    </DemoStack>
  ),
  EmailInput: () => <EmailInput aria-label="Email" placeholder="you@example.com" className="max-w-sm" />,
  PasswordInput: () => <PasswordInput aria-label="Password" placeholder="Enter password" className="max-w-sm" />,
  SearchInput: () => <SearchInput aria-label="Search" className="max-w-sm" placeholder="Search..." />,
  UrlInput: () => <UrlInput aria-label="URL" placeholder="https://ui.swqt.net" className="max-w-sm" />,
  TelInput: () => <TelInput aria-label="Phone" placeholder="+1 555 0100" className="max-w-sm" />,
  NumberInput: () => <NumberInput aria-label="Amount" placeholder="0.00" step="0.01" className="max-w-sm" />,
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
    const [preset, setPreset] = useState<"today" | "7d" | "30d">("7d");
    return (
      <DemoStack>
        <DatePicker
          valueUtc={valueUtc}
          onValueUtcChange={(next) => setValueUtc(next)}
          id="portal-date-picker"
        />
        <DateRangePresetPicker value={preset} onValueChange={(next) => setPreset(next)} />
      </DemoStack>
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
      <Chip>@swqt/ui</Chip>
      <Chip variant="outline">1.0.0</Chip>
    </DemoSection>
  ),
  InlineNotice: () => <InlineNotice>Synced from SSOT</InlineNotice>,
  EmptyState: () => <EmptyState>No packages matched your filter.</EmptyState>,
  LoadingState: () => <LoadingState label="Loading catalog" />,
  Skeleton: () => <Skeleton className="h-control-md w-48" />,
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
    <DemoStack>
      <section className="grid gap-3">
        <h3 className="text-sm font-medium text-foreground">Composition</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardCompositionExample
            label="Title · subtitle · actions"
            title="Deploy staging"
            subtitle="Review changes before promoting the build."
            actions
          />
          <CardCompositionExample
            label="Title · subtitle"
            title="Package summary"
            subtitle="Registry metadata and install guidance."
          />
          <CardCompositionExample label="Title · actions" title="Delete workspace" actions />
          <CardCompositionExample label="Title only" title="Recent activity" />
          <CardCompositionExample label="Actions only" actions />
          <CardCompositionExample label="Body only" />
        </div>
      </section>
    </DemoStack>
  ),
  DescriptionList: () => (
    <DemoStack>
      <section className="grid w-full max-w-3xl gap-3">
        <h3 className="text-sm font-medium text-foreground">User / client summary</h3>
        <DescriptionList>
          <DescriptionItem label="Username">ada.lovelace</DescriptionItem>
          <DescriptionItem label="Email">ada@example.com</DescriptionItem>
          <DescriptionItem label="Status">
            <Badge variant="success">Active</Badge>
          </DescriptionItem>
          <DescriptionItem label="User ID" mono copyable>
            018f3c2a-9b1e-7d4c-8a2f-1e6b0c9d4a7e
          </DescriptionItem>
          <DescriptionItem label="Scopes" values={["openid", "profile", "email", "offline_access"]} />
          <DescriptionItem label="Secondary email" />
          <DescriptionItem label="Audit details" span="full">
            <SourceCode
              language="json"
              maxHeightClassName="max-h-48"
              value={`{
  "event": "client.updated",
  "actor": "admin@example.com",
  "changes": ["redirect_uris", "scopes"]
}`}
            />
          </DescriptionItem>
        </DescriptionList>
      </section>
      <section className="grid w-full max-w-md gap-3">
        <h3 className="text-sm font-medium text-foreground">Compact · 1 column</h3>
        <DescriptionList columns={1} compact>
          <DescriptionItem label="Client ID" mono copyable>
            oauth_client_01HZX…
          </DescriptionItem>
          <DescriptionItem label="Grant types" values={["authorization_code", "refresh_token"]} />
          <DescriptionItem label="Deleted at" empty="Never" />
        </DescriptionList>
      </section>
    </DemoStack>
  ),
  DescriptionItem: () => (
    <DescriptionList className="max-w-md" columns={1}>
      <DescriptionItem label="Client ID" hint="Opaque public identifier" mono copyable>
        0190abcd-ef12-3456-7890-abcdef012345
      </DescriptionItem>
      <DescriptionItem label="Redirect URIs" values={["https://app.example.com/callback"]} />
    </DescriptionList>
  ),
  DescriptionSection: () => (
    <DescriptionSection
      className="max-w-3xl"
      title="OAuth client"
      description="Read-only summary fields for the selected client."
    >
      <DescriptionList>
        <DescriptionItem label="Name">Portal public client</DescriptionItem>
        <DescriptionItem label="Status">
          <Badge variant="ready">Ready</Badge>
        </DescriptionItem>
        <DescriptionItem label="client_id" mono copyable>
          0190abcd-ef12-3456-7890-abcdef012345
        </DescriptionItem>
      </DescriptionList>
    </DescriptionSection>
  ),
  CopyableText: () => (
    <DemoSection title="Inline copy">
      <CopyableText value="0190abcd-ef12-3456-7890-abcdef012345" mono />
      <CopyableText value="https://app.example.com/invite/abc" />
    </DemoSection>
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
  ServerDataTable: () => {
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const rows = [...tableRows].sort((left, right) =>
      sortDirection === "asc" ? left.name.localeCompare(right.name) : right.name.localeCompare(left.name)
    );
    return (
      <WideScreenGate title="ServerDataTable" description="Widen the viewport to preview the server table demo.">
        <ServerDataTable
          columns={[
            { id: "name", header: "Name", sortable: { key: "name", label: "Name" }, cell: (row) => row.name },
            { id: "status", header: "Status", cell: (row) => row.status }
          ]}
          rows={rows}
          getRowId={(row) => row.id}
          sortKey="name"
          sortDirection={sortDirection}
          onSortChange={(_, nextDirection) => setSortDirection(nextDirection)}
          emptyMessage="No rows"
        />
      </WideScreenGate>
    );
  },
  PopoverSelect: () => {
    const [status, setStatus] = useState("all");
    return (
      <PopoverSelect
        aria-label="Status filter"
        value={status}
        onValueChange={setStatus}
        options={[
          { value: "all", label: "All" },
          { value: "ready", label: "Ready" }
        ]}
      />
    );
  },
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
  SourceCode: () => (
    <SourceCode
      className="max-w-xl"
      language="tsx"
      value={`import { Button } from "@swqt/ui";

export function Example() {
  return <Button variant="passkey">Verify</Button>;
}`}
    />
  ),
  TtyLine: () => <TtyLine className="max-w-xl" value="$ sw doctor --project . --fix" />,
  Tty: () => (
    <Tty
      className="max-w-xl"
      value={`$ bun run check:design-contract
Design-contract check passed.

$ sw doctor --project . --fix
All checks passed.

$ deploy --env staging --dry-run
error: missing token DEPLOY_TOKEN`}
    />
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
          <PaginationEllipsis />
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
        <AccordionTrigger>What is @swqt/ui?</AccordionTrigger>
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
  PasskeyDialog: () => <PasskeyDialogDemo />,
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
        <Button variant="link">@swqt/ui</Button>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm">Design system package overview.</HoverCardContent>
    </HoverCard>
  ),
  TableOfContents: () => {
    const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
    const items = [
      { id: "toc-demo-overview", title: "Overview", level: 2 as const },
      { id: "toc-demo-setup", title: "Setup", level: 2 as const },
      { id: "toc-demo-details", title: "Details", level: 2 as const },
      { id: "toc-demo-nested", title: "Nested item", level: 3 as const }
    ];
    const activeId = useScrollSpy({
      ids: items.map((item) => item.id),
      root: scrollRoot,
      offset: 12
    });

    return (
      <div className="grid max-w-2xl gap-4 lg:grid-cols-[9rem_minmax(0,1fr)]">
        <TableOfContents
          items={items}
          activeId={activeId}
          heading="Sections"
          scrollRoot={scrollRoot}
          scrollOffset={12}
        />
        <div ref={setScrollRoot} className="h-64 overflow-y-auto rounded-md border border-border bg-card">
          <div className="space-y-16 p-4 text-sm">
            <section id="toc-demo-overview" className="scroll-mt-3 space-y-2">
              <h4 className="font-medium">Overview</h4>
              <p className="text-muted-foreground">Sticky directory tracks the active section while you scroll.</p>
            </section>
            <section id="toc-demo-setup" className="scroll-mt-3 space-y-2">
              <h4 className="font-medium">Setup</h4>
              <p className="text-muted-foreground">Assign stable ids to headings, then pass them as TOC items.</p>
            </section>
            <section id="toc-demo-details" className="scroll-mt-3 space-y-2">
              <h4 className="font-medium">Details</h4>
              <p className="text-muted-foreground">Click a TOC entry to scroll the nearest container or page.</p>
              <p id="toc-demo-nested" className="scroll-mt-3 text-muted-foreground">
                Nested item supports level-3 indentation in the nav.
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  },
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
        <Line type="monotone" dataKey="value" stroke="var(--metric-instrument)" strokeWidth={2} isAnimationActive={false} />
      </LineChart>
    </ChartContainer>
  ),
  ChartTooltipContent: () => (
    <DocumentedException>
      Use inside <code>ChartContainer</code> via{" "}
      <code>
        ChartTooltip content={'{'}&lt;ChartTooltipContent /&gt;{'}'}
      </code>
      .
    </DocumentedException>
  ),
  ChartLegendContent: () => (
    <DocumentedException>
      Render with{" "}
      <code>
        ChartLegend content={'{'}&lt;ChartLegendContent /&gt;{'}'}
      </code>{" "}
      inside a chart container.
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
