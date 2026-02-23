"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterFormValues, registerSchema } from "./ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/lib/config";

interface RegisterModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  defaultRole?: "TOURIST" | "GUIDE" | "ADMIN";
  hideRoleSelector?: boolean;
}

export default function RegisterModal({
  open,
  setOpen,
  setLoginOpen,
  defaultRole = "TOURIST",
  hideRoleSelector = false,
}: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
        sm:max-w-lg
        h-screen
        bg-white dark:bg-zinc-950
        border border-zinc-200 dark:border-zinc-800
        p-8 rounded-xl

        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=open]:slide-in-from-top-16
        data-[state=closed]:slide-out-to-top-16
        duration-500
        "
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white">
            Sign Up
          </DialogTitle>
          <button onClick={() => setOpen(false)}>
            <X className="text-zinc-500 hover:text-red-500" />
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800 pb-4">
          Create your DreamsTour Account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-2">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Name
            </label>
            <div className="relative mt-2">
              <User
                className="absolute left-3 top-3.5 text-zinc-400"
                size={18}
              />
              <input
                {...register("name")}
                type="text"
                placeholder="Enter Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-md border
                border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-white
                focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Email
            </label>
            <div className="relative mt-2">
              <Mail
                className="absolute left-3 top-3.5 text-zinc-400"
                size={18}
              />
              <input
                {...register("email")}
                type="email"
                placeholder="Enter Email"
                className="w-full pl-10 pr-4 py-3 rounded-md border
                border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-white
                focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Role Selection - Hidden when hideRoleSelector is true */}
          {!hideRoleSelector && (
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Register As: {defaultRole === "GUIDE" ? "Guide" : "Tourist"}
              </label>
              <div className="mt-2 px-4 py-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white">
                {defaultRole === "GUIDE" ? "Guide" : "Tourist"}
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Password
            </label>
            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3.5 text-zinc-400"
                size={18}
              />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full pl-10 pr-10 py-3 rounded-md border
                border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-white
                focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-zinc-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <Lock
                className="absolute left-3 top-3.5 text-zinc-400"
                size={18}
              />
              <input
                {...register("confirmPassword")}
                type={showConfirm ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full pl-10 pr-10 py-3 rounded-md border
                border-zinc-300 dark:border-zinc-700
                bg-white dark:bg-zinc-900
                text-zinc-900 dark:text-white
                focus:ring-2 focus:ring-red-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-3.5 text-zinc-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-400">
            <input type="checkbox" />
            <span>
              I agree with the{" "}
              <span className="text-red-500 cursor-pointer">
                Terms Of Service.
              </span>
            </span>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Register →"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800" />
            Or
            <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800" />
          </div>

          {/* Social Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 py-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              Google
            </button>
            <button
              type="button"
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 py-3 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              Facebook
            </button>
          </div>

          {/* Switch */}
          <div
            onClick={() => {
              setLoginOpen(true);
              setOpen(false);
            }}
            className="text-center text-sm text-zinc-600 dark:text-zinc-400"
          >
            Already have an account?{" "}
            <span className="text-red-500 cursor-pointer">Sign In</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
