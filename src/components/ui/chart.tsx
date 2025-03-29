import * as React from "react"
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  Sector,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Area,
  AreaChart as RechartsAreaChart
} from "recharts"

import { cn } from "@/lib/utils"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FDB462", "#FB8072", "#80B1D3", "#BEBADA"]

const THEMES = {
  blue: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe", "#eff6ff"],
  green: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#dcfce7", "#f0fdf4"],
  red: ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca", "#fee2e2", "#fef2f2"],
  purple: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe", "#f5f3ff"],
  yellow: ["#ca8a04", "#eab308", "#facc15", "#fde047", "#fef08a", "#fef9c3", "#fefce8"],
  orange: ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5", "#fff7ed"],
  pink: ["#c026d3", "#d946ef", "#e879f9", "#f0abfc", "#f5d0fe", "#fae8ff", "#fbefff"],
  dark: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0", "#f8fafc"],
  grey: ["#374151", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6", "#f9fafb"],
  white: ["#FFFFFF", "#FDFDFD", "#FCFCFC", "#FBFBFB", "#FAFAFA", "#F9F9F9", "#F8F8F8", "#F7F7F7"],
}

/* -----------------------------------------------------------------------------
 * Context
 * -------------------------------------------------------------------------- */

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const chartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(chartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContext Provider")
  }
  return context
}

/* -----------------------------------------------------------------------------
 * Style
 * -------------------------------------------------------------------------- */

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const classes = []
  
  // Manually creating style for chart colors
  for (const [key, value] of Object.entries(config)) {
    if ("color" in value && value.color) {
      classes.push(`.${id} .color-${key} { color: ${value.color}; fill: ${value.color}; stroke: ${value.color}; }`)
    } else if ("theme" in value) {
      const theme = value.theme as Record<keyof typeof THEMES, string>
      for (const [themeKey, themeColor] of Object.entries(theme)) {
        const themeColors = THEMES[themeKey as keyof typeof THEMES]
        for (let i = 0; i < themeColors.length; i++) {
          classes.push(
            `.${id} .color-${key}-${i + 1} { color: ${themeColors[i]}; fill: ${themeColors[i]}; stroke: ${themeColors[i]}; }`
          )
        }
      }
    }
  }

  return <style>{classes.join("\n")}</style>
}

/* -----------------------------------------------------------------------------
 * BarChart
 * -------------------------------------------------------------------------- */

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  categories: string[]
  index?: string
  hideAxis?: boolean
  colors?: string[]
  layout?: "vertical" | "horizontal" // Use "vertical" for column chart
}

export function BarChart({
  data,
  categories,
  index = "category",
  hideAxis = false,
  colors = ["blue", "green", "yellow", "red"],
  layout = "vertical",
  className,
  ...props
}: BarChartProps) {
  // Prepare data for Recharts
  const chartData = React.useMemo(() => {
    return categories.map((category, i) => ({
      [index]: category,
      value: data[i] || 0,
    }))
  }, [categories, data, index])

  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          layout={layout === "vertical" ? "horizontal" : "vertical"}
          margin={{ top: 10, right: 10, left: hideAxis ? 0 : 35, bottom: hideAxis ? 0 : 35 }}
        >
          {!hideAxis && (
            <>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              {layout === "vertical" ? (
                <>
                  <XAxis dataKey={index} />
                  <YAxis />
                </>
              ) : (
                <>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey={index} />
                </>
              )}
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-200 p-2 rounded shadow-sm dark:bg-black dark:border-gray-800">
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Value: {payload[0].value}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </>
          )}
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -----------------------------------------------------------------------------
 * LineChart
 * -------------------------------------------------------------------------- */

interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  categories: string[]
  index?: string
  hideAxis?: boolean
  colors?: string[]
}

export function LineChart({
  data,
  categories,
  index = "date",
  hideAxis = false,
  colors = ["blue"],
  className,
  ...props
}: LineChartProps) {
  // Prepare data for Recharts
  const chartData = React.useMemo(() => {
    return categories.map((category, i) => ({
      [index]: category,
      value: data[i] || 0,
    }))
  }, [categories, data, index])

  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: hideAxis ? 0 : 35, bottom: hideAxis ? 0 : 35 }}
        >
          {!hideAxis && (
            <>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey={index} />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-200 p-2 rounded shadow-sm dark:bg-black dark:border-gray-800">
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Value: {payload[0].value}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </>
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={COLORS[colors.length > 0 ? COLORS.indexOf(colors[0]) % COLORS.length : 0]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -----------------------------------------------------------------------------
 * PieChart
 * -------------------------------------------------------------------------- */

interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { name: string; value: number }[]
  index?: string
  valueKey?: string
  hideLabel?: boolean
}

export function PieChart({
  data,
  index = "name",
  valueKey = "value",
  hideLabel = false,
  className,
  ...props
}: PieChartProps) {
  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey={valueKey}
            nameKey={index}
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={!hideLabel}
            label={!hideLabel && ((entry) => entry[index])}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-200 p-2 rounded shadow-sm dark:bg-black dark:border-gray-800">
                    <div className="font-medium">{payload[0].name}</div>
                    <div className="text-sm text-muted-foreground">
                      Value: {payload[0].value}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

/* -----------------------------------------------------------------------------
 * AreaChart
 * -------------------------------------------------------------------------- */

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  categories: string[]
  index?: string
  hideAxis?: boolean
  colors?: string[]
}

export function AreaChart({
  data,
  categories,
  index = "date",
  hideAxis = false,
  colors = ["blue"],
  className,
  ...props
}: AreaChartProps) {
  // Prepare data for Recharts
  const chartData = React.useMemo(() => {
    return categories.map((category, i) => ({
      [index]: category,
      value: data[i] || 0,
    }))
  }, [categories, data, index])

  return (
    <div className={cn("w-full", className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: hideAxis ? 0 : 35, bottom: hideAxis ? 0 : 35 }}
        >
          {!hideAxis && (
            <>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey={index} />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-200 p-2 rounded shadow-sm dark:bg-black dark:border-gray-800">
                        <div className="font-medium">{label}</div>
                        <div className="text-sm text-muted-foreground">
                          Value: {payload[0].value}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </>
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS[colors.length > 0 ? COLORS.indexOf(colors[0]) % COLORS.length : 0]}
            fill={COLORS[colors.length > 0 ? COLORS.indexOf(colors[0]) % COLORS.length : 0]}
            fillOpacity={0.2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}