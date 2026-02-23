"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import SignInModal from "./Login";
import RegisterModal from "./Register";

export default function AuthWrapper() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

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
