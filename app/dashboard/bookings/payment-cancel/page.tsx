"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCancel = async () => {
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        try {
          // Call backend to mark payment as failed
          await authFetch(`${BASE_URL}/payments/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });
        } catch (error) {
          console.error("Failed to update payment status:", error);
        }
      }

      toast.error("Payment cancelled");
      router.push("/dashboard/bookings");
    };

    handleCancel();
  }, [router, searchParams]);

  return null;
}
