"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import SuccessAnimation from "@/components/SuccessAnimation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      router.replace("/dashboard/bookings");
      return;
    }

    authFetch(`${BASE_URL}/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    })
      .then(() => {
        setVerified(true);
        toast.success("Payment successful!");
        setTimeout(() => router.replace("/dashboard/bookings"), 3000);
      })
      .catch(() => {
        router.replace("/dashboard/bookings");
      });
  }, [bookingId]);

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <SuccessAnimation className="w-64 h-64" />
        <h1 className="text-2xl font-bold text-green-600 mt-2">Payment Successful!</h1>
        <p className="text-zinc-500 mt-1">Redirecting to your bookings...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-zinc-500">Verifying payment...</p>
      </div>
    </div>
  );
}
