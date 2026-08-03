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
}

export default function BookingButton({
  userRole: initialUserRole,
  tourId,
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
        className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all font-semibold text-sm lg:w-full lg:text-base"
      >
        Book Now
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
