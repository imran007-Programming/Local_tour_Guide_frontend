"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;

  useEffect(() => {
    if (!bookingId) {
      router.replace("/dashboard/bookings");
      return;
    }

    console.log("verify calling for bookingId:", bookingId);

    authFetch(`${BASE_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then((res) => {
        toast.success("Payment successful!");
      })
      .catch(() => {})
      .finally(() => {
        router.replace("/dashboard/bookings");
      });
  }, [bookingId]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-zinc-500">Verifying payment...</p>
      </div>
    </div>
  );
}
