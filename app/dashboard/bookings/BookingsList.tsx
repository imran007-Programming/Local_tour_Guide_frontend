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
import { CheckCircle, Clock, XCircle, CheckCheck, Search } from "lucide-react";
import BookingPagination from "./BookingPagination";
import { Input } from "@/components/ui/input";

export default function BookingsList({ user }: { user: User }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [cancelReason, setCancelReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
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
      },
    );

    if (res?.ok) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBookingId ? { ...b, status: "CANCELLED" } : b,
        ),
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
    console.log(result);

    if (res?.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
      toast.success("Status updated");
    } else {
      toast.error(result?.message);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      let endpoint = "";
      if (isGuide) {
        endpoint = "/bookings/assigned";
      } else if (isTourist) {
        endpoint = "/bookings/me";
      } else if (isAdmin) {
        endpoint = "/bookings";
      }

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
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
    };

    const debounce = setTimeout(fetchBookings, 300);
    return () => clearTimeout(debounce);
  }, [isGuide, currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

  if (loading) {
    return <div className="text-gray-600 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by tour, tourist name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Status: {statusFilter || "All"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("PENDING")}>
              PENDING
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("CONFIRMED")}>
              CONFIRMED
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
              COMPLETED
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("CANCELLED")}>
              CANCELLED
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Sort: {sortBy}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortBy("createdAt")}>
              Created Date
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("bookingDateTime")}>
              Booking Date
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{sortOrder === "asc" ? "↑" : "↓"}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSortOrder("asc")}>
              Ascending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortOrder("desc")}>
              Descending
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400">No bookings found</p>
        </div>
      ) : (
        <>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
            >
              <div className="flex gap-4 mb-4">
                <Image
                  src={booking.tour.images[0] || "/placeholder.jpg"}
                  alt={booking.tour.title}
                  width={150}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    {booking.tour.title}
                  </h3>
                  {isGuide ? (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Tourist: {booking.tourist.user.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Email: {booking.tourist.user.email}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Guide: {booking.guide.user.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        Guide_mail: {booking.guide.user.email}
                      </p>
                    </>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Date: {format(new Date(booking.bookingDateTime), "PPP p")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Booking_Status:{" "}
                    <span
                      className={`font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "text-green-600"
                          : booking.status === "PENDING"
                            ? "text-yellow-600"
                            : booking.status === "CANCELLED"
                              ? "text-red-600"
                              : booking.status === "COMPLETED"
                                ? "text-green-600"
                                : "text-gray-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>
                  {booking.message && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Message: {booking.message}
                    </p>
                  )}
                  {isGuide &&
                    booking.status === "CANCELLED" &&
                    booking.cancelReason && (
                      <p className="text-red-600 dark:text-red-400 text-sm">
                        Cancel Reason: {booking.cancelReason}
                      </p>
                    )}
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="text-2xl font-bold text-red-600">
                    ${booking.tour.price}
                  </p>
                  {isTourist &&
                    (booking.payment?.status === "COMPLETED" ? (
                      <span className="text-green-600 font-semibold">Paid</span>
                    ) : (
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition">
                        Pay Now
                      </button>
                    ))}
                  {isAdmin && (
                    <span
                      className={`font-semibold ${
                        booking.payment?.status === "COMPLETED"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {/* {booking.payment?.status === "COMPLETED" ? "Paid" : "Pending"} */}
                    </span>
                  )}
                  {isTourist && booking.status !== "CANCELLED" && (
                    <button
                      onClick={() => {
                        setSelectedBookingId(booking.id);
                        setCancelModalOpen(true);
                      }}
                      className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white px-4 py-2 rounded-lg transition mt-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-gray-600 dark:text-gray-400">
                  Payment Status:{" "}
                  <span
                    className={`font-semibold ${
                      booking.payment?.status === "COMPLETED"
                        ? "text-green-600"
                        : booking.payment?.status === "PENDING"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {booking.payment?.status || "PENDING"}
                  </span>
                </div>
                {isGuide && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => updateStatus(booking.id, "COMPLETED")}
                      >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        COMPLETED
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => updateStatus(booking.id, "CANCELLED")}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        CANCELLED
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <BookingPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block mb-2 text-sm font-medium">
              Reason for cancellation
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Please provide a reason..."
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCancelModalOpen(false);
                setCancelReason("");
              }}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={cancelBooking}
              disabled={!cancelReason.trim()}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
