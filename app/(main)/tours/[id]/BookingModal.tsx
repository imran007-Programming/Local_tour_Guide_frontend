"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  dialogClass,
  iconButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/Auth/authStyles";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { BASE_URL } from "@/lib/config";
import { authFetch } from "@/lib/authFetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);

    // Combine date and time into a single DateTime
    const [hours, minutes] = time.split(":");
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
    if (data?.success) toast.success("Booking request sent successfully!");
    if (data?.error?.statusCode === 409) {
      toast.error(`${data.message}`);
    }

    if (res?.ok) {
      setOpen(false);
      setDate(undefined);
      setTime("10:00");
      setMessage("");
      router.push("/dashboard/bookings");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={`${dialogClass} max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl`}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-zinc-900 dark:text-white">
                Request a booking
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Pick a date and time. Your guide will confirm it.
              </DialogDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className={`${iconButtonClass} -mr-2 -mt-1`}
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="flex-1">
                <p className={labelClass}>Date</p>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 [&>*]:w-full"
                  disabled={(date) => date <= new Date()}
                />
              </div>

              <div className="flex flex-1 flex-col gap-5">
                <div>
                  <label htmlFor="booking-time" className={labelClass}>
                    Time
                  </label>
                  <input
                    id="booking-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <label htmlFor="booking-message" className={labelClass}>
                    Message <span className="font-normal text-zinc-400">(optional)</span>
                  </label>
                  <textarea
                    id="booking-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Any special requests or questions…"
                    className={cn(inputClass, "h-32 flex-1 resize-none py-3")}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-5 dark:border-zinc-800">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {date ? `${format(date, "EEE, d MMM yyyy")} at ${time}` : "No date selected"}
              </p>
              <button
                type="submit"
                disabled={!date || loading}
                className={cn(primaryButtonClass, "w-auto shrink-0 px-6")}
              >
                {loading ? "Sending…" : "Send request"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
