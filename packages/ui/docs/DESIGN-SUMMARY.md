# Design summary (shipped with `@swui/ui`)

Consumer-facing design intent. Token **values** live in `@swui/ui-tokens`.

## Checklist (new page / control)

- Prefer existing primitives from this package.
- Use semantic tokens; do not hard-code chroma as the only state signal.
- Cover loading, error, empty, ready, refresh/stale, disabled, focus-visible.
- Icon-only controls need accessible names; tables need visible headers; failures use Alert semantics.
- Do not add a second toast system or a second icon library.

## Typography & rhythm

- Font: Inter stack (see tokens).
- Base rhythm 4px; common gaps 8 / 12 / 16 / 24 / 32px.
- Default control height is 40px (`h-control-md`); panel radius max 8px (`--radius`).

## Responsive (library-relevant)

- Compact `<=820px`, wide `>=821px`.
- Use complete classes: `hidden min-data-dense:block` / `hidden max-data-dense:block` (avoid merge-collapsing `cn("hidden", …, "block")`).
- **Adapt** when content works as stacks/cards/forms; **gate** dense tables with `WideScreenGate`.

## Component patterns (short)

| Need | Use |
|------|-----|
| Actions | `Button` (`default` / `secondary` / `outline` / `ghost` / `link` / `destructive`) |
| Panels | `Card` (not nested page sections) |
| Static table | `Table` + `ScrollArea` / `Pagination` |
| Client sort/filter/select | `DataTable` |
| Server search/sort/cursor | `ServerDataTable` |
| Failures | `Alert` |
| Empty | `Empty` (`zero-data` / `filtered` / `error` / `no-permission` / `network-error`) |
| Loading | `Spinner` / `Skeleton` / `loading` compositions / `Progress` |
| Toast | `Toaster` + `notifySuccess` / `notifyError` / … |
| Forms | `Label` `Input` `Textarea` `Select` `Checkbox` `Switch` `RadioGroup` `Slider` `Field` `Form` `Combobox` `InputGroup` `Calendar` `DatePicker` |
| Overlays | `Dialog` `AlertDialog` `Sheet` `DropdownMenu` `ContextMenu` `Tooltip` `Popover` `HoverCard` |
| Nav primitives | `Tabs` `Breadcrumb` `Toggle` `ToggleGroup` (`Sidebar` is showcase-oriented) |

## Icons

- Library: `lucide-react` named imports only.
- Default size follows host (`[&_svg]:size-4` on buttons).
- Icon-only: `aria-label`. With text: `aria-hidden="true"` on the icon.

## Dates

- Persist UTC ISO instants; display local via package date helpers.
- `DatePicker` / `Calendar` for single-day selection.

## Interaction & a11y

- Visible `focus-visible` rings; disabled stays legible.
- Keep stale data visible during refresh/error when available.
- Do not rely on color alone for state.
