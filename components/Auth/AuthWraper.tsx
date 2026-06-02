"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import SignInModal from "./Login";
import RegisterModal from "./Register";

export default function AuthWrapper() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const handleOpenAuth = () => {
      setRegisterOpen(true);
    };

    window.addEventListener("openAuthModal", handleOpenAuth);
    return () => window.removeEventListener("openAuthModal", handleOpenAuth);
  }, []);

  return (
    <>
      <Button onClick={() => setLoginOpen(true)}>Sign In</Button>

      <SignInModal
        open={loginOpen}
        setOpen={setLoginOpen}
        setRegisterOpen={setRegisterOpen}
      />

      <RegisterModal
        open={registerOpen}
        setOpen={setRegisterOpen}
        setLoginOpen={setLoginOpen}
      />
    </>
  );
}
