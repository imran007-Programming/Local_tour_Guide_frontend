"use client";

// Recharts is large, so the charts live here and DashboardHome loads this
// module lazily instead of shipping it with the dashboard's first paint.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

type MonthlyPoint = { month: string; bookings: number };
type StatusSlice = { name: string; value: number; color: string };

const axisTick = { fontSize: 11, fill: "#9CA3AF" };
const tooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  fontSize: "12px",
};

export function BookingsAreaChart({
  data,
  color,
  label,
}: {
  data: MonthlyPoint[];
  color: string;
  label: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTick} />
        <YAxis axisLine={false} tickLine={false} tick={axisTick} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="bookings"
          stroke={color}
          strokeWidth={2.5}
          fill="url(#bookingGradient)"
          name={label}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data }: { data: StatusSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3} strokeWidth={0}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({
  data,
  color,
  label,
}: {
  data: MonthlyPoint[];
  color: string;
  label: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={axisTick} />
        <YAxis axisLine={false} tickLine={false} tick={axisTick} />
        <Tooltip cursor={{ fill: "rgba(99, 102, 241, 0.05)" }} contentStyle={tooltipStyle} />
        <Bar dataKey="bookings" fill={color} radius={[8, 8, 0, 0]} name={label} />
      </BarChart>
    </ResponsiveContainer>
  );
}
