"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { User } from "@/types/user";
import { Calendar, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalAmount: 0,
    averageValue: 0,
  });
  const [bookingStats, setBookingStats] = useState([
    { name: "Completed", value: 0, color: "#22C55E" },
    { name: "Pending", value: 0, color: "#FACC15" },
    { name: "Confirmed", value: 0, color: "#3B82F6" },
    { name: "Cancelled", value: 0, color: "#EF4444" },
  ]);
  const [monthlyData, setMonthlyData] = useState([
    { month: "Jan", bookings: 0 },
    { month: "Feb", bookings: 0 },
    { month: "Mar", bookings: 0 },
    { month: "Apr", bookings: 0 },
    { month: "May", bookings: 0 },
    { month: "Jun", bookings: 0 },
    { month: "Jul", bookings: 0 },
    { month: "Aug", bookings: 0 },
    { month: "Sep", bookings: 0 },
    { month: "Oct", bookings: 0 },
    { month: "Nov", bookings: 0 },
    { month: "Dec", bookings: 0 },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      const endpoint =
        user.data.role === "ADMIN"
          ? "/bookings/stats"
          : user.data.role === "GUIDE"
            ? "/bookings/assigned/stats"
            : "/bookings/me/stats";

      const res = await authFetch(`${BASE_URL}${endpoint}`);
      if (res?.ok) {
        const data = await res.json();

        setStats(
          data.data || { totalBookings: 0, totalAmount: 0, averageValue: 0 },
        );

        // Handle chartData (convert object to array)
        if (data.data?.chartData) {
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const monthlyArray = months.map((month) => ({
            month,
            bookings: data.data.chartData[month] || 0,
          }));
          setMonthlyData(monthlyArray);
        }

        // Handle statusBreakdown (if exists)
        if (data.data?.statusBreakdown) {
          setBookingStats([
            {
              name: "Completed",
              value: data.data.statusBreakdown.COMPLETED || 0,
              color: "#22C55E",
            },
            {
              name: "Pending",
              value: data.data.statusBreakdown.PENDING || 0,
              color: "#FACC15",
            },
            {
              name: "Confirmed",
              value: data.data.statusBreakdown.CONFIRMED || 0,
              color: "#3B82F6",
            },
            {
              name: "Cancelled",
              value: data.data.statusBreakdown.CANCELLED || 0,
              color: "#EF4444",
            },
          ]);
        }
      } else {
        console.error("API Error:", res?.status, res?.statusText);
      }
    };
    fetchStats();
  }, [user?.data?.role]);
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-black dark:text-white flex">
      {/* Main */}
      <div className="flex-1 p-6 space-y-6">
        {/* Top Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings.toString()}
            icon={<Calendar className="h-8 w-8 text-red-600" />}
          />
          <StatCard
            title="Total Amount"
            value={`$${stats.totalAmount.toFixed(2)}`}
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
          />
          <StatCard
            title="Average Value"
            value={`$${stats.averageValue.toFixed(2)}`}
            icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Monthly Bookings Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" stroke="#8884d8" />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#EF4444"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Stats */}
          <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Booking Status</h2>

            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStats}
                    dataKey="value"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                  >
                    {bookingStats.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {bookingStats.map((stat) => (
                <div
                  key={stat.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    <span className="text-sm">{stat.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className="opacity-80">{icon}</div>
      </div>
    </div>
  );
}
