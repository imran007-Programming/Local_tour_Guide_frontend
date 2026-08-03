"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import successAnimation from "@/public/payment_success/success.json";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

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
      <div className="w-64 h-64">
        <Lottie
          lottieRef={lottieRef}
          animationData={successAnimation}
          loop={false}
        />
      </div>
      <h1 className="text-2xl font-bold text-green-600 mt-4">Payment Successful!</h1>
      <p className="text-zinc-500 mt-2">Redirecting to your bookings...</p>
    </div>
  );
}
