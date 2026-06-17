"use client";

import { useState } from "react";
import SignInModal from "@/components/Auth/Login";
import SignUpModal from "@/components/Auth/Register";
import BookingModal from "./BookingModal";

interface BookingButtonProps {
  userRole?: string;
  tourId: string;
}

export default function BookingButton({
  userRole,
  tourId,
}: BookingButtonProps) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleBooking = () => {
    if (!userRole) {
      setSignInOpen(true);
      return;
    }
    if (userRole !== "TOURIST") {
      setSignInOpen(true);
      return;
    }
    setBookingOpen(true);
  };

  return (
    <>
      <button
        onClick={handleBooking}
        className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-6 rounded-lg hover:from-red-700 hover:to-red-600 transition-all font-semibold text-sm lg:w-full lg:text-base"
      >
        Reserve
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
      />
      <SignUpModal
        setLoginOpen={setSignInOpen}
        open={signUpOpen}
        setOpen={setSignUpOpen}
      />
    </>
  );
}
