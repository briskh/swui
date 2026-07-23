# Component catalog (`@swqt/ui`)

Import from `@swqt/ui` or `@swqt/ui/<name>`.

## Actions

| Export | Notes |
|--------|--------|
| `Button` | Variants: default, secondary, outline, ghost, link, destructive, passkey. Sizes: compact, sm, default, lg, icon, icon-compact. |

## Forms

| Export | Notes |
|--------|--------|
| `Label` `Input` `Textarea` | Pair Label via `htmlFor` / `id`. |
| `FormField` `FormActions` `Fieldset` `CheckboxField` | eauth-aligned form layout helpers; `CheckboxField` wraps Radix `Checkbox`. |
| `Select` | Radix select. |
| `Checkbox` `Switch` `RadioGroup` `Slider` | Choice / range. |
| `Field` | Help + error grouping. |
| `Form` | React Hook Form helpers. |
| `Combobox` `Command` | cmdk-backed search. |
| `InputGroup` | Affix composition. |
| `Calendar` `DatePicker` | UTC storage helpers in `@swqt/ui/date`. |

## Feedback

| Export | Notes |
|--------|--------|
| `Alert` `Badge` | Status / labels. `Badge`: default, ready, loading, error, success, warning, destructive, outline. `Alert`: default, destructive, success, warning. |
| `Chip` | Mono text chip; default / outline. |
| `InlineNotice` | Inline success hint with check icon (`--status-ready`). |
| `EmptyState` `LoadingState` | Card-wrapped empty / loading placeholders (eauth parity). |
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
| `ThemeProvider` `useTheme` `ThemeControl` `Theme` | Global `system` / `light` / `dark` preference; effective theme is light or dark. |
| `cn` | `@swqt/ui/utils` |
| Date helpers | `@swqt/ui/date` |
| `WideScreenGate` `WideScreenPlaceholder` | Compact `<=820px` gate; import from `@swqt/ui`. |
