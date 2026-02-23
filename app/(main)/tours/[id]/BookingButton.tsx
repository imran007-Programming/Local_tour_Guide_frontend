"use client";

import { useState } from "react";
import SignInModal from "@/components/Auth/Login";
import SignUpModal from "@/components/Auth/Register";
import BookingModal from "./BookingModal";

interface BookingButtonProps {
  userRole?: string;
  tourId: string;
}

export default function BookingButton({ userRole, tourId }: BookingButtonProps) {
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleBooking = () => {
    if (userRole !== "TOURIST") {
      setSignInOpen(true);
    } else {
      setBookingOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleBooking}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
      >
        Book Now
      </button>

      <BookingModal open={bookingOpen} setOpen={setBookingOpen} tourId={tourId} />

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
