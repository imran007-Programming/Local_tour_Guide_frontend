"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { User } from "@/types/user";
import { Booking } from "@/types/bookings";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import Spinner from "@/components/ui/spinner";
import { DollarSign, TrendingUp, Clock, UserCircle } from "lucide-react";

export default function EarningsList({ user }: { user: User }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEarnings = async () => {
      const res = await authFetch(`${BASE_URL}/bookings/assigned`, {
        cache: "no-store",
      });

      if (res?.ok) {
        const result = await res.json();
        setBookings(result.data.data || []);
      } else {
        setError("Failed to fetch bookings");
      }
      setLoading(false);
    };

    fetchEarnings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="space-y-4 p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED" && b.payment
  );

  const pendingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.bookingDateTime) > new Date(),
  );

  const totalEarnings = completedBookings.reduce((sum, b) => {
    return sum + (b.payment?.amount || 0);
  }, 0);

  const pendingEarnings = pendingBookings.reduce(
    (sum, b) => sum + b.tour.price,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-950 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Earnings</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${pendingEarnings.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completed Tours</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {completedBookings.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold dark:text-white">Earnings History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Tourist
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Paid At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : completedBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    No completed earnings yet. You have {bookings.length} total booking(s).
                  </td>
                </tr>
              ) : (
                completedBookings.map((booking) => {
                  const payment = booking.payment;
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm dark:text-gray-300">
                        {booking.tour.title}
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-gray-300">
                        <div className="flex items-center gap-3">
                          {booking.tourist.user.profilePic ? (
                            <Image
                              src={booking.tourist.user.profilePic}
                              alt={booking.tourist.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <UserCircle className="h-8 w-8 text-gray-400" />
                          )}
                          <span>{booking.tourist.user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-gray-300">
                        {booking.tourist.user.email}
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-gray-300">
                        {format(
                          new Date(booking.bookingDateTime),
                          "MMM dd, yyyy",
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                        ${payment?.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm dark:text-gray-300">
                        {payment?.paidAt
                          ? format(new Date(payment.paidAt), "MMM dd, yyyy")
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
