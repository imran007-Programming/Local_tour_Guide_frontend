"use client";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { X, Eye, EyeOff, MapPin, ArrowRight, Compass, Backpack } from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "./ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import Spinner from "../ui/spinner";
import {
  dialogClass,
  errorClass,
  iconButtonClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  textLinkClass,
} from "./authStyles";

interface RegisterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  defaultRole?: "TOURIST" | "GUIDE" | "ADMIN";
  hideRoleSelector?: boolean;
}

function PasswordField({
  id,
  label,
  error,
  autoComplete,
  inputProps,
}: {
  id: string;
  label: string;
  error?: string;
  autoComplete: string;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...inputProps}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder="••••••••"
          aria-invalid={!!error}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1.5 top-[calc(50%+3px)] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

export default function RegisterModal({
  open,
  setOpen,
  setLoginOpen,
  defaultRole = "TOURIST",
  hideRoleSelector = false,
}: RegisterModalProps) {
  const isGuide = defaultRole === "GUIDE";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (result.success) {
        toast.success("Registration successful! Please login.");
        reset();
        setOpen(false);
        setLoginOpen(true);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton={false}
        className={`${dialogClass} max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[440px]`}
      >
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
            {isGuide ? "Become a guide" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {isGuide
              ? "Share your city with travellers and earn from your tours."
              : "Book tours with verified local guides."}
          </DialogDescription>

          {!hideRoleSelector && (
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              {isGuide ? <Compass size={13} /> : <Backpack size={13} />}
              Signing up as {isGuide ? "a guide" : "a traveller"}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            <div>
              <label htmlFor="register-name" className={labelClass}>
                Full name
              </label>
              <input
                id="register-name"
                {...register("name")}
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
                className={inputClass}
              />
              {errors.name && <p className={errorClass}>{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="register-email" className={labelClass}>
                Email
              </label>
              <input
                id="register-email"
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                id="register-password"
                label="Password"
                autoComplete="new-password"
                error={errors.password?.message}
                inputProps={register("password")}
              />
              <PasswordField
                id="register-confirm"
                label="Confirm password"
                autoComplete="new-password"
                error={errors.confirmPassword?.message}
                inputProps={register("confirmPassword")}
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-zinc-900 dark:accent-white"
              />
              <span>
                I agree to the <span className="font-medium text-zinc-900 dark:text-white">Terms of Service</span>
              </span>
            </label>

            <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setLoginOpen(true);
                setOpen(false);
              }}
              className={textLinkClass}
            >
              Sign in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
