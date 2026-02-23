"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "./ValidationSchema";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

interface SignInModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRegisterOpen: (open: boolean) => void;
}

export default function SignInModal({
  open,
  setOpen,
  setRegisterOpen,
}: SignInModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login Data:", data);
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        router.push("/dashboard");
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="
        sm:max-w-md
        bg-white dark:bg-zinc-900
        border border-zinc-200 dark:border-zinc-800
        p-8 rounded-xl

        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        data-[state=closed]:fade-out-0
        data-[state=open]:fade-in-0
        data-[state=closed]:slide-out-to-top-10
        data-[state=open]:slide-in-from-top-10
        duration-500
        "
      >
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl cursor-pointer font-bold text-zinc-900 dark:text-white">
            Sign In
          </DialogTitle>
          <button onClick={() => setOpen(false)}>
            <X className="cursor-pointer" />
          </button>
        </div>

        <p className="mt-2 text-sm text-center text-zinc-600 dark:text-zinc-400">
          Sign in to start managing your DreamsTour account
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter Email"
              className="mt-2 w-full px-4 py-3 rounded-md border
              border-zinc-300 dark:border-zinc-700
              bg-white dark:bg-zinc-800
              text-zinc-900 dark:text-white
              focus:ring-2 focus:ring-red-500 outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              Password
            </label>

            <div className="relative mt-2">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                className="w-full px-4 pr-10 py-3 rounded-md border
      border-zinc-300 dark:border-zinc-700
      bg-white dark:bg-zinc-800
      text-zinc-900 dark:text-white
      focus:ring-2 focus:ring-red-500 outline-none"
              />

              {/* Eye Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-red-500"
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

          {/* Remember Me */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 text-zinc-700 dark:text-zinc-400">
              <input type="checkbox" {...register("remember")} />
              Remember Me
            </label>
            <span className="text-red-500 cursor-pointer">
              Forgot Password?
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login →"}
          </button>

          {/* Switch to Register */}
          <div
            onClick={() => {
              setRegisterOpen(true);
              setOpen(false);
            }}
            className="text-center text-sm text-zinc-600 dark:text-zinc-400"
          >
            Don’t have an account?{" "}
            <span className="text-red-500 cursor-pointer">Sign up</span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
