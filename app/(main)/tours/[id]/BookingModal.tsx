"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { BASE_URL } from "@/lib/config";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";

interface BookingModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  tourId: string;
}

export default function BookingModal({
  open,
  setOpen,
  tourId,
}: BookingModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("10:00");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    
    // Combine date and time into a single DateTime
    const [hours, minutes] = time.split(':');
    const bookingDateTime = new Date(date);
    bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const res = await authFetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tourId,
        bookingDateTime: bookingDateTime.toISOString(),
        message,
      }),
    });
    const data = await res?.json();
    console.log(data);
    if (data?.success) toast.success("Booking request sent successfully!");
    if (data?.error?.statusCode === 409) {
      toast.error(`${data.message}`);
    }

    if (res?.ok) {
      setOpen(false);
      setDate(undefined);
      setTime("10:00");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <DialogTitle className="text-2xl font-bold">Book Tour</DialogTitle>
          <button onClick={() => setOpen(false)}>
            <X className="text-zinc-500 hover:text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={(date) => date < new Date()}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-3 border rounded-lg dark:bg-zinc-900"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any special requests or questions..."
              className="w-full p-3 border rounded-lg dark:bg-zinc-900 min-h-24"
            />
          </div>

          <button
            type="submit"
            disabled={!date || loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
