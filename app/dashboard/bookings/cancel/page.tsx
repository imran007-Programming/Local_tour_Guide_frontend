"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    toast.error("Payment cancelled");
    router.push("/dashboard/bookings");
  }, [router]);

  return null;
}
