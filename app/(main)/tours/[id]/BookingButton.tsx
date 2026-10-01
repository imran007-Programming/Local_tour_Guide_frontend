"use client";

import { useState } from "react";
import SignInModal from "@/components/Auth/Login";
import SignUpModal from "@/components/Auth/Register";
import BookingModal from "./BookingModal";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { BASE_URL } from "@/lib/config";

interface BookingButtonProps {
  userRole?: string;
  tourId: string;
  className?: string;
}

export default function BookingButton({
  userRole: initialUserRole,
  tourId,
  className = "",
}: BookingButtonProps) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleBooking = () => {
    if (!initialUserRole || initialUserRole !== "TOURIST") {
      setSignInOpen(true);
      return;
    }
    setBookingOpen(true);
  };

  const handleLoginSuccess = async () => {
    // fetch fresh user role after login
    const res = await clientAuthFetch(`${BASE_URL}/auth/me`);
    const data = res?.ok ? await res.json() : null;
    const role = data?.data?.role;
    if (role === "TOURIST") {
      setBookingOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleBooking}
        className={`h-12 shrink-0 rounded-full bg-blue-500 text-sm font-medium text-white shadow-sm shadow-blue-500/25 transition-colors hover:bg-blue-600 ${className}`}
      >
        Book now
      </button>

      <BookingModal
        open={bookingOpen}
        setOpen={setBookingOpen}
        tourId={tourId}
      />

      <SignInModal
        setRegisterOpen={setSignUpOpen}
        open={signInOpen}
        setOpen={setSignInOpen}
        onSuccess={handleLoginSuccess}
      />
      <SignUpModal
        setLoginOpen={setSignInOpen}
        open={signUpOpen}
        setOpen={setSignUpOpen}
      />
    </>
  );
}
