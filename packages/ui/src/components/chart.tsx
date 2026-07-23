import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "../lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

export type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
};

export function ChartContainer({ id, className, children, config, ...props }: ChartContainerProps) {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          initialDimension={{ width: 320, height: 240 }}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, item]) => item.color);
  if (!entries.length) {
    return null;
  }

  const css = entries.map(([key, item]) => `--color-${key}: ${item.color};`).join("\n");

  return <style>{`[data-chart=${id}] { ${css} }`}</style>;
}

export const ChartTooltip = RechartsPrimitive.Tooltip;

type ChartTooltipPayloadItem = {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
};

export function ChartTooltipContent({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: ChartTooltipPayloadItem[];
  label?: string | number;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="grid min-w-32 gap-1.5 rounded-md border border-border bg-popover px-2.5 py-1.5 text-xs text-popover-foreground shadow-md">
      {label ? <div className="font-medium">{String(label)}</div> : null}
      <div className="grid gap-1">
        {payload.map((item: ChartTooltipPayloadItem) => {
          const key = String(item.dataKey ?? item.name ?? "value");
          const entry = config[key];
          return (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{entry?.label ?? key}</span>
              <span className="font-mono font-medium">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const ChartLegend = RechartsPrimitive.Legend;

export function ChartLegendContent({ payload }: { payload?: Array<{ value?: string; color?: string }> }) {
  const { config } = useChart();
  if (!payload?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3 text-xs">
      {payload.map((entry) => {
        const key = String(entry.value ?? "");
        const item = config[key];
        return (
          <div key={key} className="flex items-center gap-1.5">
            <span className="size-2 rounded-[2px]" style={{ backgroundColor: entry.color ?? item?.color }} />
            <span>{item?.label ?? key}</span>
          </div>
        );
      })}
    </div>
  );
}
