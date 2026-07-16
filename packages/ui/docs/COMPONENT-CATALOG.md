# Component catalog (`@swui/ui`)

Import from `@swui/ui` or `@swui/ui/<name>`.

## Actions

| Export | Notes |
|--------|--------|
| `Button` | Variants: default, secondary, outline, ghost, link, destructive. Sizes: default, sm, icon. |

## Forms

| Export | Notes |
|--------|--------|
| `Label` `Input` `Textarea` | Pair Label via `htmlFor` / `id`. |
| `Select` | Radix select. |
| `Checkbox` `Switch` `RadioGroup` `Slider` | Choice / range. |
| `Field` | Help + error grouping. |
| `Form` | React Hook Form helpers. |
| `Combobox` `Command` | cmdk-backed search. |
| `InputGroup` | Affix composition. |
| `Calendar` `DatePicker` | UTC storage helpers in `@swui/ui/date`. |

## Feedback

| Export | Notes |
|--------|--------|
| `Alert` `Badge` | Status / labels. |
| `Skeleton` `Spinner` `Progress` | Loading. |
| `Empty` | Variants: zero-data, filtered, error, no-permission, network-error. |
| `Toaster` `toastPolicy` `notifySuccess` `notifyError` `notifyAction` `notifyPersistent` | Sonner; single project toaster. |
| `InlineLoading` `LoadingButtonContent` `SkeletonStack` `StaleDataRefresh` `ProgressBlock` | From `loading`. |

## Data display

| Export | Notes |
|--------|--------|
| `Card` (+ header/content/title helpers) | Panels. |
| `Table` (+ parts) | Static markup. |
| `DataTable` | Client TanStack table; wraps `WideScreenGate`. |
| `ServerDataTable` | Server search/sort/cursor; viewport fill default on. |
| `PopoverSelect` | Short enum header filters (with ServerDataTable). |
| `Separator` `ScrollArea` `Pagination` | Layout / scan. |
| `Accordion` `Collapsible` | Progressive disclosure. |
| `Avatar` | Fixture/entity display. |

## Overlay

| Export | Notes |
|--------|--------|
| `Dialog` `AlertDialog` `Sheet` | Modal / drawer. |
| `DropdownMenu` `ContextMenu` | Menus (shared semantics). |
| `Tooltip` `Popover` `HoverCard` | Light overlays. |

## Navigation primitives

| Export | Notes |
|--------|--------|
| `Tabs` | Panels. |
| `Breadcrumb` (+ `BreadcrumbTrail`) | Pass items; **no** product `routeTree` wiring here. |
| `Toggle` `ToggleGroup` | Mode switches. |
| `Sidebar` | Showcase-oriented; do not treat as product AppShell nav. |

## Charts

| Export | Notes |
|--------|--------|
| `Chart*` helpers in `chart` | recharts fixtures; no live API. |

## Theme & utils

| Export | Notes |
|--------|--------|
| `ThemeProvider` `useTheme` `ThemeControl` `Theme` | Light-only. |
| `cn` | `@swui/ui/utils` |
| Date helpers | `@swui/ui/date` |
| `WideScreenGate` `WideScreenPlaceholder` | Compact `<=820px` gate; import from `@swui/ui`. |
