"use client";

import { useEffect, useState } from "react";
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CreditCard,
  DollarSign,
  Loader2,
  MapPin,
  MousePointerClick,
  Search,
  User as UserIcon,
  X,
  XCircle,
} from "lucide-react";

const PAGE_SIZE = 10;

const STATUSES = [
  { value: "all", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_BADGE: Record<string, string> = {
  CONFIRMED: "border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400",
  PENDING: "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
  CANCELLED: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
};

const PAYMENT_TEXT: Record<string, string> = {
  PAID: "text-emerald-600 dark:text-emerald-400",
  PENDING: "text-amber-600 dark:text-amber-400",
  FAILED: "text-red-600 dark:text-red-400",
};

const titleCase = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

// Same look as the users table
const chip =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-dashed border-slate-300 bg-white px-3.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const pageBtn =
  "flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800";
const th =
  "h-12 whitespace-nowrap border-r border-slate-200 px-4 text-left align-middle text-[13px] font-medium text-slate-500 last:border-r-0 dark:border-zinc-800 dark:text-zinc-400";
const td =
  "border-r border-slate-200 px-4 py-3 align-middle last:border-r-0 dark:border-zinc-800";
const person = "whitespace-nowrap text-slate-600 dark:text-zinc-300";

export default function BookingsTable({
  user,
  initialStatus,
}: {
  user: User;
  initialStatus?: string;
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus || "");
  const [sortOrder, setSortOrder] = useState("desc");
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const isGuide = user.data.role === "GUIDE";
  const isTourist = user.data.role === "TOURIST";
  const isAdmin = user.data.role === "ADMIN";

  // Any filter change goes back to page 1, otherwise page 3 of a 1-page result is empty
  const updateFilter = (apply: () => void) => {
    apply();
    setCurrentPage(1);
  };

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
    let cancelled = false;

    const fetchBookings = async () => {
      setFetching(true);
      let endpoint = "";
      if (isGuide) endpoint = "/bookings/assigned";
      else if (isTourist) endpoint = "/bookings/me";
      else if (isAdmin) endpoint = "/bookings";

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: String(PAGE_SIZE),
        sortBy: "createdAt",
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const res = await authFetch(`${BASE_URL}${endpoint}?${params}`, {
        cache: "no-store",
      });

      // A newer request already replaced this one, so drop its answer
      if (cancelled) return;

      if (res?.ok) {
        const result = await res.json();
        if (cancelled) return;
        setBookings(result.data.data || []);
        const meta = result.data.meta;
        setTotalCount(meta.total);
        setTotalPages(Math.max(1, Math.ceil(meta.total / meta.limit)));
      }
      setLoading(false);
      setFetching(false);
    };

    const debounce = setTimeout(fetchBookings, 300);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [isGuide, isTourist, isAdmin, currentPage, searchTerm, statusFilter, sortOrder]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    );
  }

  const hasFilters = searchTerm || statusFilter;
  const from = totalCount === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, totalCount);
  const statusLabel = STATUSES.find((s) => s.value === statusFilter)?.label;
  // Admins only look; tourists and guides get row actions
  const showActions = !isAdmin;
  const columnCount = (isAdmin ? 6 : 5) + (showActions ? 1 : 0);

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
          <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={chip}>
                  <CircleDot size={13} />
                  Status{statusFilter ? `: ${statusLabel}` : ""}
                  <ChevronDown size={12} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuRadioGroup
                  value={statusFilter || "all"}
                  onValueChange={(v) => updateFilter(() => setStatusFilter(v === "all" ? "" : v))}
                >
                  {STATUSES.map((s) => (
                    <DropdownMenuRadioItem key={s.value} value={s.value}>
                      {s.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => updateFilter(() => setSortOrder(sortOrder === "asc" ? "desc" : "asc"))}
              className={chip}
              aria-label="Toggle sort direction"
            >
              {sortOrder === "asc" ? <ArrowUpNarrowWide size={13} /> : <ArrowDownWideNarrow size={13} />}
              {sortOrder === "asc" ? "Oldest first" : "Newest first"}
            </button>

            {hasFilters && (
              <button
                onClick={() =>
                  updateFilter(() => {
                    setSearchTerm("");
                    setStatusFilter("");
                  })
                }
                className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              >
                <X size={13} />
                Reset
              </button>
            )}
          </div>

          <div className="relative w-full sm:w-56 sm:shrink-0">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search bookings"
              value={searchTerm}
              onChange={(e) => updateFilter(() => setSearchTerm(e.target.value))}
              className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-xs text-slate-900 outline-none ring-blue-500/30 transition placeholder:text-slate-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Table */}
        <div className={`flex-1 overflow-x-auto transition-opacity ${fetching ? "opacity-50" : "opacity-100"}`}>
          <table className="w-full min-w-230 border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 dark:border-zinc-800 dark:bg-zinc-900/60">
                <th className={th}>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={13} />Tour</span>
                </th>
                <th className={th}>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />Date</span>
                </th>
                {(isGuide || isAdmin) && (
                  <th className={th}>
                    <span className="inline-flex items-center gap-1.5"><UserIcon size={13} />Tourist</span>
                  </th>
                )}
                {(isTourist || isAdmin) && (
                  <th className={th}>
                    <span className="inline-flex items-center gap-1.5"><UserIcon size={13} />Guide</span>
                  </th>
                )}
                <th className={th}>
                  <span className="inline-flex items-center gap-1.5"><DollarSign size={13} />Price</span>
                </th>
                <th className={th}>
                  <span className="inline-flex items-center gap-1.5"><CircleDot size={13} />Status</span>
                </th>
                <th className={th}>
                  <span className="inline-flex items-center gap-1.5"><CreditCard size={13} />Payment</span>
                </th>
                {showActions && (
                  <th className={th}>
                    <span className="inline-flex items-center gap-1.5"><MousePointerClick size={13} />Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={columnCount} className="py-16 text-center text-sm text-slate-500 dark:text-zinc-400">
                    {statusFilter ? `No ${statusFilter.toLowerCase()} bookings` : "No bookings found"}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const paid = booking.payment?.status === "PAID";
                  const isCancelled = booking.status === "CANCELLED";
                  const canPay = isTourist && !paid && !isCancelled;
                  const canUpdate = isGuide && !isCancelled && booking.status !== "COMPLETED";

                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50/70 dark:border-zinc-800 dark:hover:bg-zinc-900/60"
                    >
                      <td className={td}>
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-800">
                            <Image
                              src={booking.tour.images[0] || "/hero/Hero1.jpg"}
                              alt={booking.tour.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-56">
                            <p className="truncate font-medium text-slate-900 dark:text-white">
                              {booking.tour.title}
                            </p>
                            {booking.message && (
                              <p className="truncate text-xs italic text-slate-500 dark:text-zinc-400">
                                “{booking.message}”
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={`${td} whitespace-nowrap text-slate-600 dark:text-zinc-300`}>
                        {format(new Date(booking.bookingDateTime), "dd MMM yyyy, h:mm a")}
                      </td>
                      {(isGuide || isAdmin) && (
                        <td className={`${td} ${person}`}>{booking.tourist?.user?.name ?? "—"}</td>
                      )}
                      {(isTourist || isAdmin) && (
                        <td className={`${td} ${person}`}>{booking.guide?.user?.name ?? "—"}</td>
                      )}
                      <td className={`${td} whitespace-nowrap font-semibold text-slate-900 dark:text-white`}>
                        ${booking.tour.price}
                      </td>
                      <td className={td}>
                        <span
                          className={`inline-block rounded-md border px-2.5 py-1 text-[13px] font-medium ${
                            STATUS_BADGE[booking.status] || "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {titleCase(booking.status)}
                        </span>
                        {isCancelled && booking.cancelReason && (
                          <p className="mt-1 max-w-44 truncate text-xs text-rose-500 dark:text-rose-400" title={booking.cancelReason}>
                            {booking.cancelReason}
                          </p>
                        )}
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <p className={`font-medium ${PAYMENT_TEXT[booking.payment?.status ?? ""] || "text-slate-500 dark:text-zinc-400"}`}>
                          {booking.payment?.status ? titleCase(booking.payment.status) : "Not paid"}
                        </p>
                        {booking.payment?.paidAt && (
                          <p className="text-xs text-slate-400">
                            {format(new Date(booking.payment.paidAt), "dd MMM yyyy")}
                          </p>
                        )}
                      </td>
                      {showActions && (
                        <td className={td}>
                          <div className="flex items-center gap-2">
                            {canPay && (
                              <>
                                <button
                                  onClick={() => handlePayment(booking.id)}
                                  disabled={paymentLoading === booking.id}
                                  className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md bg-blue-500 px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
                                >
                                  {paymentLoading === booking.id ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : (
                                    <CreditCard size={14} />
                                  )}
                                  Pay now
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedBookingId(booking.id);
                                    setCancelModalOpen(true);
                                  }}
                                  className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:border-rose-500 hover:bg-rose-500 hover:text-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-rose-500 dark:hover:bg-rose-500 dark:hover:text-white"
                                >
                                  Cancel
                                </button>
                              </>
                            )}

                            {canUpdate && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800">
                                    Update status
                                    <ChevronDown size={13} />
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

                            {!canPay && !canUpdate && <span className="text-slate-400">—</span>}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 text-[13px] text-slate-500 sm:flex-row dark:border-zinc-800 dark:text-zinc-400">
          <span>
            {from}-{to} of {totalCount} bookings
          </span>
          <div className="flex items-center gap-2">
            <button
              className={pageBtn}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={pageBtn}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

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
    </>
  );
}
