"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { X, Eye, EyeOff, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "./ValidationSchema";
import { Spinner } from "../ui/spinner";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/loginAction";
import { notifyAuthChanged } from "@/hooks/useCurrentUser";
import { motion } from "framer-motion";
import {
  dialogClass,
  errorClass,
  iconButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  textLinkClass,
} from "./authStyles";

interface SignInModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRegisterOpen: (open: boolean) => void;
  onSuccess?: () => void;
}

const demoAccounts = [
  { label: "Admin", email: "admin@gmail.com", password: "52535455" },
  { label: "Guide", email: "guide@gmail.com", password: "123456" },
  { label: "Tourist", email: "tourist@gmail.com", password: "123456" },
];

export default function SignInModal({
  open,
  setOpen,
  setRegisterOpen,
  onSuccess,
}: SignInModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(result.message || "Invalid credentials");
        setIsLoading(false);
        return;
      }

      if (result.data?.accessToken && result.data?.refreshToken) {
        await loginAction(result.data.accessToken, result.data.refreshToken);
        notifyAuthChanged();
      }

      toast.success("Login successful!");
      setOpen(false);

      if (onSuccess) {
        onSuccess();
      } else {
        setIsRedirecting(true);
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  const busy = isLoading || isSubmitting;

  return (
    <>
      {/* Full-screen redirect overlay. Portalled to <body> because an ancestor
          with backdrop-filter (the navbar) would otherwise trap `position: fixed`. */}
      {isRedirecting &&
        createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-9999 flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-950"
          >
            <Spinner size="md" className="text-zinc-900 dark:text-white" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Taking you to your dashboard…</p>
          </motion.div>,
          document.body,
        )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className={`${dialogClass} sm:max-w-100`}>
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 dark:bg-white">
                <MapPin className="h-5 w-5 text-white dark:text-zinc-900" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className={`${iconButtonClass} -mr-2 -mt-2`}
              >
                <X size={18} />
              </button>
            </div>

            <DialogTitle className="mt-5 text-xl font-semibold text-zinc-900 dark:text-white">
              Welcome back
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to your TourGuide account.
            </DialogDescription>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
              <div>
                <label htmlFor="login-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="login-email"
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={inputClass}
                />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-password" className={labelClass}>
                    Password
                  </label>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Forgot password?</span>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-1.5 top-[calc(50%+3px)] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
              </div>

              <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  {...register("remember")}
                  className="h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:accent-white"
                />
                Remember me
              </label>

              <button type="submit" disabled={busy} className={primaryButtonClass}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setRegisterOpen(true);
                  setOpen(false);
                }}
                className={textLinkClass}
              >
                Sign up
              </button>
            </p>
          </div>

          {/* Demo logins */}
          <div className="rounded-b-2xl border-t border-zinc-200 bg-zinc-50 px-6 py-4 sm:px-8 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Quick demo login</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.label}
                  type="button"
                  disabled={busy}
                  onClick={() => onSubmit({ email: acc.email, password: acc.password })}
                  className="h-9 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-white"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
