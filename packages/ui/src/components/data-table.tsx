import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type Table as TanstackTable
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "../lib/utils";
import { WideScreenGate } from "./wide-screen-gate";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type DataTableColumnMeta = {
  /** Fixed column width (for example selection or action columns). Remaining columns share leftover space. */
  fixedWidth?: number | string;
  /** Relative width weight for flexible columns. Defaults to 1. Ignored when fixedWidth is set. */
  widthWeight?: number;
  headerClassName?: string;
  cellClassName?: string;
};

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> extends DataTableColumnMeta {}
}

function resolveFixedWidth(fixedWidth: number | string): string {
  return typeof fixedWidth === "number" ? `${fixedWidth}px` : fixedWidth;
}

function buildFixedWidthExpression<TData>(columns: Column<TData, unknown>[]): string | null {
  const fixedWidths = columns
    .map((column) => column.columnDef.meta?.fixedWidth)
    .filter((fixedWidth): fixedWidth is number | string => fixedWidth != null)
    .map(resolveFixedWidth);

  if (fixedWidths.length === 0) {
    return null;
  }

  return fixedWidths.length === 1 ? `calc(100% - ${fixedWidths[0]})` : `calc(100% - ${fixedWidths.join(" - ")})`;
}

function buildFlexibleColumnWidths<TData>(columns: Column<TData, unknown>[]): Map<string, string> {
  const widths = new Map<string, string>();
  const flexibleColumns = columns.filter((column) => !column.columnDef.meta?.fixedWidth);

  if (flexibleColumns.length === 0) {
    return widths;
  }

  const totalWeight = flexibleColumns.reduce((sum, column) => sum + (column.columnDef.meta?.widthWeight ?? 1), 0);
  const availableWidth = buildFixedWidthExpression(columns) ?? "100%";

  for (const column of flexibleColumns) {
    const weight = column.columnDef.meta?.widthWeight ?? 1;
    const ratio = weight / totalWeight;
    widths.set(column.id, availableWidth === "100%" ? `${ratio * 100}%` : `calc(${availableWidth} * ${ratio})`);
  }

  return widths;
}

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
  enableRowSelection?: boolean;
  getRowId?: (row: TData) => string;
  filterColumnId?: string;
  filterPlaceholder?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  className,
  enableRowSelection = false,
  getRowId,
  filterColumnId,
  filterPlaceholder = "Filter rows..."
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: { sorting, columnFilters, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection
  });

  const leafColumns = table.getVisibleLeafColumns();
  const flexibleColumnWidths = React.useMemo(() => buildFlexibleColumnWidths(leafColumns), [leafColumns]);

  return (
    <WideScreenGate
      title="Data table requires a wider screen"
      description="Sorting, filtering, and row selection need desktop width. Open this page on a PC or widen the browser window."
    >
      <div className={cn("grid gap-4", className)}>
        {filterColumnId ? (
          <Input
            aria-label={filterPlaceholder}
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(filterColumnId)?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        ) : null}
        <div className="w-full overflow-hidden rounded-md border">
          <Table className="table-fixed">
            <colgroup>
              {leafColumns.map((column) => {
                const meta = column.columnDef.meta;
                const width = meta?.fixedWidth
                  ? resolveFixedWidth(meta.fixedWidth)
                  : flexibleColumnWidths.get(column.id);

                return <col key={column.id} style={width ? { width } : undefined} />;
              })}
            </colgroup>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className={cn("min-w-0", header.column.columnDef.meta?.headerClassName)}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className={cn("min-w-0", cell.column.columnDef.meta?.cellClassName)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {enableRowSelection ? (
          <p className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
          </p>
        ) : null}
      </div>
    </WideScreenGate>
  );
}

export function DataTableColumnHeader<TData, TValue>({ column, title }: { column: Column<TData, TValue>; title: string }) {
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      className="-ml-3 h-8 px-2 text-xs font-semibold uppercase tracking-wide"
      onClick={() => column.toggleSorting(sorted === "asc")}
    >
      {title}
      {sorted === "desc" ? (
        <ArrowDown aria-hidden="true" className="ml-2 size-4" />
      ) : sorted === "asc" ? (
        <ArrowUp aria-hidden="true" className="ml-2 size-4" />
      ) : (
        <ArrowUpDown aria-hidden="true" className="ml-2 size-4 opacity-50" />
      )}
    </Button>
  );
}

export function DataTableSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: "select",
    meta: {
      fixedWidth: 48,
      headerClassName: "w-12 px-2",
      cellClassName: "w-12 px-2"
    },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableSorting: false,
    enableHiding: false
  };
}

export type { TanstackTable };
