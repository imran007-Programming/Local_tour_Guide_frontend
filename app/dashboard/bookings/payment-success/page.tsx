"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import SuccessAnimation from "@/components/SuccessAnimation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleSuccess = async () => {
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        try {
          await authFetch(`${BASE_URL}/payments/success`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
        } catch (error) {
          console.error("Failed to update payment status:", error);
        }
      }

      toast.success("Payment successful!");
      setTimeout(() => router.push("/dashboard/bookings"), 3000);
    };

    handleSuccess();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
      <SuccessAnimation className="w-64 h-64" />
      <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h1>
      <p className="text-zinc-500 mt-2">Redirecting to your bookings...</p>
    </div>
  );
}
