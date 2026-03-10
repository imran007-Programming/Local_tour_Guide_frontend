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
      // Log complete URL structure
      console.log('=== URL Structure ===');
      console.log('Full URL:', window.location.href);
      console.log('Pathname:', window.location.pathname);
      console.log('Search params:', window.location.search);
      console.log('Session ID:', searchParams.get("session_id"));
      console.log('All params:', Object.fromEntries(searchParams.entries()));
      console.log('==================');
      
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
