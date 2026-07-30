"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import { format } from "date-fns";
import Image from "next/image";
import { Booking } from "@/types/bookings";
import { User } from "@/types/user";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  XCircle,
  CheckCheck,
  Search,
  Filter,
  ArrowUpDown,
  MapPin,
  Clock,
  CreditCard,
  AlertCircle,
  Loader2,
} from "lucide-react";
import BookingsPagination from "./BookingsPagination";
import { motion } from "framer-motion";

export default function BookingsTable({
  user,
  initialStatus,
}: {
  user: User;
  initialStatus?: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const isGuide = user.data.role === "GUIDE";
  const isTourist = user.data.role === "TOURIST";
  const isAdmin = user.data.role === "ADMIN";

  const cancelBooking = async () => {
    const res = await authFetch(
      `${BASE_URL}/bookings/${selectedBookingId}/cancel`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason }),
      }
    );
    if (res?.ok) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingId ? { ...b, status: "CANCELLED" } : b
        )
      );
      toast.success("Booking cancelled");
      setCancelModalOpen(false);
      setCancelReason("");
    } else {
      toast.error("Failed to cancel booking");
    }
  };

  const updateStatus = async (bookingId: string, status: string) => {
    const res = await authFetch(`${BASE_URL}/bookings/${bookingId}/respond`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = await res?.json();
    if (res?.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      toast.success("Status updated");
    } else {
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    // payment success is handled by /dashboard/bookings/[bookingId] page
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      setPaginationLoading(true);
      let endpoint = "";
      if (isGuide) endpoint = "/bookings/assigned";
      else if (isTourist) endpoint = "/bookings/me";
      else if (isAdmin) endpoint = "/bookings";

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "5",
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const res = await authFetch(`${BASE_URL}${endpoint}?${params}`, {
        cache: "no-store",
      });
      if (res?.ok) {
        const result = await res.json();
        setBookings(result.data.data || []);
        const meta = result.data.meta;
        setTotalPages(Math.ceil(meta.total / meta.limit));
      }
      setLoading(false);
      setPaginationLoading(false);
    };

    const debounce = setTimeout(fetchBookings, 300);
    return () => clearTimeout(debounce);
  }, [isGuide, isTourist, isAdmin, currentPage, searchTerm, statusFilter, sortBy, sortOrder, refetchTrigger]);

  const handlePayment = async (bookingId: string) => {
    setPaymentLoading(bookingId);
    try {
      const successUrl = `${window.location.origin}/dashboard/bookings/${bookingId}?payment=success`;
      const cancelUrl = `${window.location.origin}/dashboard/bookings/payment-cancel`;

      await authFetch(`${BASE_URL}/payments/stripe/create-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const res = await authFetch(`${BASE_URL}/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, successUrl, cancelUrl }),
      });

      if (res?.ok) {
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch {
      toast.error("Payment error occurred");
    } finally {
      setPaymentLoading(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400";
      case "PENDING":
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case "COMPLETED":
        return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400";
      case "CANCELLED":
        return "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400";
      default:
        return "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400";
    }
  };

  const getPaymentStyle = (status?: string) => {
    switch (status) {
      case "PAID":
        return "text-emerald-600 dark:text-emerald-400";
      case "PENDING":
        return "text-amber-600 dark:text-amber-400";
      case "FAILED":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-zinc-500 dark:text-zinc-400";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex gap-4">
              <div className="w-24 h-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 animate-pulse" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {showSuccess && successAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Lottie animationData={successAnimation} loop={false} style={{ width: "100vw", height: "100vh" }} />
        </div>
      )}

      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              placeholder="Search tours, names, or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl h-10 gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
                <Filter size={14} />
                {statusFilter || "All Status"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("CONFIRMED")}>Confirmed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("CANCELLED")}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="rounded-xl h-10 w-10 p-0 border-zinc-200 dark:border-zinc-800"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>

        {/* Bookings */}
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <MapPin size={28} className="text-zinc-400" />
            </div>
            <h3 className="text-base font-medium text-zinc-900 dark:text-white">No bookings found</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {statusFilter ? `No ${statusFilter.toLowerCase()} bookings` : "Your bookings will appear here"}
            </p>
          </div>
        ) : paginationLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
                <div className="flex gap-4">
                  <div className="w-24 h-20 bg-zinc-200 dark:bg-zinc-700 rounded-xl animate-pulse shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Tour Image */}
                    <div className="relative w-full sm:w-28 h-40 sm:h-24 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={booking.tour.images[0] || "/placeholder.jpg"}
                        alt={booking.tour.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {booking.tour.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {format(new Date(booking.bookingDateTime), "MMM dd, yyyy · h:mm a")}
                            </span>
                            <span className="flex items-center gap-1">
                              {isGuide ? `Tourist: ${booking.tourist.user.name}` : `Guide: ${booking.guide.user.name}`}
                            </span>
                          </div>
                        </div>

                        {/* Price + Status */}
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                          <span className="text-lg font-bold text-zinc-900 dark:text-white">
                            ${booking.tour.price}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>

                      {/* Message */}
                      {booking.message && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-1 italic">
                          "{booking.message}"
                        </p>
                      )}

                      {/* Cancel reason */}
                      {booking.status === "CANCELLED" && booking.cancelReason && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1.5 flex items-center gap-1">
                          <AlertCircle size={12} />
                          {booking.cancelReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-5 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-wrap items-center justify-between gap-3">
                  {/* Payment info */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={12} className="text-zinc-400" />
                      <span className="text-zinc-500 dark:text-zinc-400">Payment:</span>
                      <span className={`font-medium ${getPaymentStyle(booking?.payment?.status)}`}>
                        {booking?.payment?.status || "NOT PAID"}
                      </span>
                    </span>
                    {booking?.payment?.paidAt && (
                      <span className="text-zinc-400">
                        {format(new Date(booking.payment.paidAt), "MMM dd, yyyy")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Tourist: Pay button */}
                    {isTourist && booking?.payment?.status !== "PAID" && booking.status !== "CANCELLED" && (
                      <button
                        onClick={() => handlePayment(booking.id)}
                        disabled={paymentLoading === booking.id}
                        className="px-4 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-1.5"
                      >
                        {paymentLoading === booking.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <CreditCard size={12} />
                        )}
                        Pay Now
                      </button>
                    )}

                    {/* Tourist: Cancel button */}
                    {isTourist && booking.status !== "CANCELLED" && booking?.payment?.status !== "PAID" && (
                      <button
                        onClick={() => {
                          setSelectedBookingId(booking.id);
                          setCancelModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Guide: Status update */}
                    {isGuide && booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition">
                            Update Status
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, "COMPLETED")}>
                            <CheckCheck className="mr-2 h-4 w-4 text-emerald-500" />
                            Mark Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, "CANCELLED")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-500" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Paid badge */}
                    {booking?.payment?.status === "PAID" && (
                      <span className="px-3 py-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center gap-1">
                        <CheckCheck size={12} />
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <BookingsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        )}

        {/* Cancel Modal */}
        <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 resize-none placeholder:text-zinc-400"
                rows={4}
                placeholder="Please provide a reason..."
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => { setCancelModalOpen(false); setCancelReason(""); }}
              >
                Close
              </Button>
              <Button
                variant="destructive"
                className="rounded-xl"
                onClick={cancelBooking}
                disabled={!cancelReason.trim()}
              >
                Cancel Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
