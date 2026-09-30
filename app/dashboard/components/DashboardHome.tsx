"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { User } from "@/types/user";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Users,
  Map,
  Star,
  Heart,
  CreditCard,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

// Charts (recharts) are code-split and loaded after the page shell renders
const chartFallback = () => (
  <div className="h-full w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
);
const BookingsAreaChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.BookingsAreaChart),
  { ssr: false, loading: chartFallback },
);
const StatusPieChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.StatusPieChart),
  { ssr: false, loading: chartFallback },
);
const MonthlyBarChart = dynamic(
  () => import("./DashboardCharts").then((m) => m.MonthlyBarChart),
  { ssr: false, loading: chartFallback },
);

export default function DashboardPage({ user }: { user: User }) {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalAmount: 0,
    averageValue: 0,
  });
  const [bookingStats, setBookingStats] = useState([
    { name: "Completed", value: 0, color: "#10B981" },
    { name: "Pending", value: 0, color: "#F59E0B" },
    { name: "Confirmed", value: 0, color: "#6366F1" },
    { name: "Cancelled", value: 0, color: "#EF4444" },
  ]);
  const [monthlyData, setMonthlyData] = useState(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
      (month) => ({ month, bookings: 0 })
    )
  );
  const [isLoading, setIsLoading] = useState(true);
  const [extraStats, setExtraStats] = useState<any>(null);

  const role = user.data.role;

  useEffect(() => {
    const fetchStats = async () => {
      const endpoint =
        role === "ADMIN"
          ? "/bookings/stats"
          : role === "GUIDE"
            ? "/bookings/assigned/stats"
            : "/bookings/me/stats";

      const res = await authFetch(`${BASE_URL}${endpoint}`);
      if (res?.ok) {
        const data = await res.json();
        setStats(data.data || { totalBookings: 0, totalAmount: 0, averageValue: 0 });

        if (data.data?.chartData) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          setMonthlyData(months.map((month) => ({ month, bookings: data.data.chartData[month] || 0 })));
        }

        if (data.data?.statusBreakdown) {
          setBookingStats([
            { name: "Completed", value: data.data.statusBreakdown.COMPLETED || 0, color: "#10B981" },
            { name: "Pending", value: data.data.statusBreakdown.PENDING || 0, color: "#F59E0B" },
            { name: "Confirmed", value: data.data.statusBreakdown.CONFIRMED || 0, color: "#6366F1" },
            { name: "Cancelled", value: data.data.statusBreakdown.CANCELLED || 0, color: "#EF4444" },
          ]);
        }
      }

      // Fetch extra stats based on role
      if (role === "ADMIN") {
        try {
          const usersRes = await authFetch(`${BASE_URL}/users?limit=1`);
          if (usersRes?.ok) {
            const usersData = await usersRes.json();
            setExtraStats({ totalUsers: usersData.data?.meta?.total || 0 });
          }
        } catch {}
      }

      setIsLoading(false);
    };
    fetchStats();
  }, [role]);

  const totalStatusCount = bookingStats.reduce((sum, s) => sum + s.value, 0);

  // Role-specific stat cards
  const getStatCards = () => {
    if (role === "ADMIN") {
      return [
        {
          title: "Total Bookings",
          value: stats.totalBookings.toString(),
          icon: <Calendar size={20} />,
          iconBg: "bg-violet-100 dark:bg-violet-900/30",
          iconColor: "text-violet-600 dark:text-violet-400",
        },
        {
          title: "Platform Revenue",
          value: `$${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: <DollarSign size={20} />,
          iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
          iconColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
          title: "Total Users",
          value: extraStats?.totalUsers?.toString() || "—",
          icon: <Users size={20} />,
          iconBg: "bg-blue-100 dark:bg-blue-900/30",
          iconColor: "text-blue-600 dark:text-blue-400",
        },
        {
          title: "Avg Booking Value",
          value: `$${stats.averageValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: <TrendingUp size={20} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
        },
      ];
    }

    if (role === "GUIDE") {
      return [
        {
          title: "Total Bookings",
          value: stats.totalBookings.toString(),
          icon: <Calendar size={20} />,
          iconBg: "bg-violet-100 dark:bg-violet-900/30",
          iconColor: "text-violet-600 dark:text-violet-400",
        },
        {
          title: "Total Earnings",
          value: `$${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: <Wallet size={20} />,
          iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
          iconColor: "text-emerald-600 dark:text-emerald-400",
        },
        {
          title: "Avg Per Tour",
          value: `$${stats.averageValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          icon: <TrendingUp size={20} />,
          iconBg: "bg-amber-100 dark:bg-amber-900/30",
          iconColor: "text-amber-600 dark:text-amber-400",
        },
      ];
    }

    // TOURIST
    return [
      {
        title: "Tours Booked",
        value: stats.totalBookings.toString(),
        icon: <Map size={20} />,
        iconBg: "bg-violet-100 dark:bg-violet-900/30",
        iconColor: "text-violet-600 dark:text-violet-400",
      },
      {
        title: "Total Spent",
        value: `$${stats.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: <CreditCard size={20} />,
        iconBg: "bg-rose-100 dark:bg-rose-900/30",
        iconColor: "text-rose-600 dark:text-rose-400",
      },
      {
        title: "Avg Per Trip",
        value: `$${stats.averageValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        icon: <TrendingUp size={20} />,
        iconBg: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
      },
    ];
  };

  // Role-specific welcome text
  const getSubtitle = () => {
    if (role === "ADMIN") return "Here's an overview of your platform's performance.";
    if (role === "GUIDE") return "Here's how your tours are performing.";
    return "Here's a summary of your travel activity.";
  };

  // Role-specific chart titles
  const getChartTitle = () => {
    if (role === "ADMIN") return "Platform Bookings";
    if (role === "GUIDE") return "Your Tour Bookings";
    return "Your Trips";
  };

  const statCards = getStatCards();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome back, {user?.data?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {getSubtitle()}
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton cardCount={statCards.length} />
      ) : (
        <>
          {/* ===== STAT CARDS ===== */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 ${statCards.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
            {statCards.map((card, i) => (
              <StatCard key={card.title} {...card} delay={i * 0.1} />
            ))}
          </div>

          {/* ===== CHARTS ROW ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Area Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                    {getChartTitle()} Overview
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Monthly trends
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  <Activity size={12} />
                  This Year
                </div>
              </div>
              <div className="h-[260px]">
                <BookingsAreaChart
                  data={monthlyData}
                  color={role === "TOURIST" ? "#F43F5E" : "#6366F1"}
                  label={role === "TOURIST" ? "Trips" : "Bookings"}
                />
              </div>
            </motion.div>

            {/* Donut Chart + Legend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
            >
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                {role === "TOURIST" ? "Trip Status" : role === "GUIDE" ? "Booking Status" : "Booking Breakdown"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                {totalStatusCount} total {role === "TOURIST" ? "trips" : "bookings"}
              </p>

              <div className="h-[180px] flex items-center justify-center">
                <StatusPieChart data={bookingStats} />
              </div>

              <div className="space-y-2.5 mt-4">
                {bookingStats.map((stat) => (
                  <div key={stat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{stat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-white">{stat.value}</span>
                      {totalStatusCount > 0 && (
                        <span className="text-xs text-zinc-400">
                          {((stat.value / totalStatusCount) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ===== BAR CHART ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  {role === "ADMIN" ? "Monthly Platform Activity" : role === "GUIDE" ? "Monthly Tour Activity" : "Monthly Travel History"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {role === "TOURIST" ? "Trips per month" : "Bookings per month"}
                </p>
              </div>
            </div>
            <div className="h-[220px]">
              <MonthlyBarChart
                data={monthlyData}
                color={role === "TOURIST" ? "#F43F5E" : role === "GUIDE" ? "#10B981" : "#6366F1"}
                label={role === "TOURIST" ? "Trips" : "Bookings"}
              />
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ===== STAT CARD ===== */
function StatCard({
  title,
  value,
  icon,
  iconBg,
  iconColor,
  delay = 0,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">
            {value}
          </h3>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

/* ===== LOADING SKELETON ===== */
function LoadingSkeleton({ cardCount = 3 }: { cardCount?: number }) {
  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${cardCount === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
        {[...Array(cardCount)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-24 animate-pulse" />
                <div className="h-7 bg-zinc-200 dark:bg-zinc-700 rounded w-32 animate-pulse" />
              </div>
              <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-36 animate-pulse mb-2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-24 animate-pulse mb-6" />
          <div className="h-[260px] bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-28 animate-pulse mb-2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-20 animate-pulse mb-6" />
          <div className="h-[180px] bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
