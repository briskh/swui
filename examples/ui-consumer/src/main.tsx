import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import {
  Alert,
  AlertDescription,
  Badge,
  BreadcrumbTrail,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltipContent,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  EmptyState,
  Field,
  FieldError,
  FieldLabel,
  InlineNotice,
  Input,
  LoadingButtonContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
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
  ThemeControl,
  ThemeProvider,
  WideScreenGate
} from "@swqt/ui";
import "./styles.css";

function App() {
  const chartData = [
    { month: "Jan", instrument: 24, asset: 18 },
    { month: "Feb", instrument: 29, asset: 21 },
    { month: "Mar", instrument: 26, asset: 25 },
    { month: "Apr", instrument: 34, asset: 28 }
  ];

  return (
    <ThemeProvider>
      <main className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground">UI consumer spike</h1>
          <ThemeControl />
        </div>
        <p className="text-sm text-muted-foreground">
          Second-app adoption proof for <code>@swqt/ui-tokens</code> and <code>@swqt/ui</code>.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Primitives</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Input aria-label="Example search" placeholder="Search components" className="max-w-xs" />
          </CardContent>
        </Card>

        <section aria-labelledby="state-matrix-heading" data-testid="state-matrix">
          <h2 id="state-matrix-heading" className="mb-3 text-lg font-semibold text-foreground">
            Core component states
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card data-testid="button-states">
              <CardHeader>
                <CardTitle>Button states</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button data-testid="button-default">Default</Button>
                <Button data-testid="button-focus-visible">Focus visible</Button>
                <Button data-testid="button-disabled" disabled>
                  Disabled
                </Button>
                <Button data-testid="button-loading" disabled aria-busy="true">
                  <LoadingButtonContent>Saving</LoadingButtonContent>
                </Button>
                <Button data-testid="button-selected" variant="secondary" aria-pressed="true">
                  Selected
                </Button>
                <Button data-testid="button-icon" aria-label="Add component">
                  +
                </Button>
              </CardContent>
            </Card>
            <Card data-testid="input-states">
              <CardHeader>
                <CardTitle>Input and select states</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Input aria-label="Default field" value="Ready" readOnly />
                <Input aria-label="Focused field" value="Focused" readOnly />
                <Input aria-label="Disabled field" value="Unavailable" disabled />
                <Field>
                  <FieldLabel htmlFor="invalid-field">Invalid field</FieldLabel>
                  <Input id="invalid-field" aria-invalid="true" value="Invalid value" readOnly />
                  <FieldError>Enter a valid value.</FieldError>
                </Field>
                <Input aria-label="Empty field" placeholder="Empty state" />
                <Select defaultValue="selected">
                  <SelectTrigger aria-label="Selected option">
                    <SelectValue placeholder="Choose a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selected">Selected option</SelectItem>
                    <SelectItem value="other">Other option</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="disabled" disabled>
                  <SelectTrigger aria-label="Disabled option">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disabled">Disabled option</SelectItem>
                  </SelectContent>
                </Select>
                <div data-testid="empty-state">
                  <EmptyState>No matching components.</EmptyState>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card data-testid="feedback-section">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Alert>
              <AlertDescription>Adoption checks passed for workspace packages.</AlertDescription>
            </Alert>
            <InlineNotice>Saved theme preference syncs across tabs.</InlineNotice>
          </CardContent>
        </Card>

        <Card data-testid="forms-section">
          <CardHeader>
            <CardTitle>Forms</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field className="flex items-center gap-2">
              <Checkbox id="terms" defaultChecked />
              <FieldLabel htmlFor="terms">Accept workspace terms</FieldLabel>
            </Field>
            <Field className="flex items-center gap-2">
              <Switch id="notifications" defaultChecked />
              <FieldLabel htmlFor="notifications">Enable notifications</FieldLabel>
            </Field>
          </CardContent>
        </Card>

        <Card data-testid="overlay-section">
          <CardHeader>
            <CardTitle>Overlay</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Workspace dialog</DialogTitle>
                  <DialogDescription>Modal overlay from the shared component library.</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card data-testid="navigation-section">
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <BreadcrumbTrail
              items={[
                { label: "Consumer", href: "/" },
                { label: "Navigation", isCurrentPage: true }
              ]}
            />
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-sm text-muted-foreground">
                Tabs switch in-page panels without routing.
              </TabsContent>
              <TabsContent value="details" className="text-sm text-muted-foreground">
                Details tab content for adoption smoke checks.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card data-testid="display-section">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Display</CardTitle>
            <Badge variant="ready">Ready</Badge>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Separator />
            <p className="text-sm text-muted-foreground">Badge and separator primitives for dense layouts.</p>
          </CardContent>
        </Card>

        <section aria-labelledby="chart-heading">
          <h2 id="chart-heading" className="mb-3 text-lg font-semibold text-foreground">
            Semantic chart colors
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Theme-aware metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                data-testid="theme-chart"
                aria-label="Instrument and asset metrics chart"
                className="h-64 w-full"
                config={{
                  instrument: { label: "Instrument", color: "var(--metric-instrument)" },
                  asset: { label: "Asset", color: "var(--metric-asset)" }
                }}
              >
                <LineChart data={chartData} title="Instrument and asset metrics">
                  <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="instrument"
                    stroke="var(--metric-instrument)"
                    strokeWidth={2}
                    dot={{ stroke: "var(--card)" }}
                    isAnimationActive={false}
                  />
                  <Line type="monotone" dataKey="asset" stroke="var(--metric-asset)" strokeWidth={2} isAnimationActive={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="dense-table-heading">
          <h2 id="dense-table-heading" className="mb-3 text-lg font-semibold text-foreground">
            Dense data table
          </h2>
          <WideScreenGate
            title="Data table requires a wider screen"
            description="Compact viewports hide this representative dense table."
          >
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Ada Lovelace</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Grace Hopper</TableCell>
                    <TableCell>Admiral</TableCell>
                    <TableCell>Active</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Katherine Johnson</TableCell>
                    <TableCell>Analyst</TableCell>
                    <TableCell>Review</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </WideScreenGate>
        </section>
      </main>
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
