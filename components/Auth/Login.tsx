"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "./ValidationSchema";
import { Spinner } from "../ui/spinner";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/loginAction";
import { AnimatePresence, motion } from "framer-motion";

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
      }

      toast.success("Login successful!");
      setOpen(false);
      setIsRedirecting(true);
      
      // Safety: auto-dismiss overlay after 8 seconds if navigation fails
      setTimeout(() => setIsRedirecting(false), 8000);
      
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      setIsRedirecting(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Full-screen redirect spinner overlay */}
      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="flex flex-col items-center gap-4"
            >
              {/* Animated spinner ring */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-14 h-14 rounded-full border-4 border-red-200 dark:border-red-900 border-t-red-500 dark:border-t-red-400"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-1 w-10 h-10 rounded-full border-4 border-transparent border-b-red-400 dark:border-b-red-300"
                />
              </div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Taking you to your dashboard...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          <button onClick={() => setOpen(false)} className="cursor-pointer">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 hover:text-red-500 cursor-pointer"
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
            disabled={isLoading || isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="border-white" />
                Logging in...
              </>
            ) : (
              "Login →"
            )}
          </button>

          {/* Switch to Register */}
          <div
            onClick={() => {
              setRegisterOpen(true);
              setOpen(false);
            }}
            className="text-center text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer"
          >
            Don’t have an account?{" "}
            <span className="text-red-500 cursor-pointer">Sign up</span>
          </div>
        </form>

        {/* Quick Login Buttons */}
        <div className="pt-4 border-t dark:border-zinc-700">
          <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mb-3">
            Quick Login (Demo)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onSubmit({ email: "admin@gmail.com", password: "52535455" })
              }
              className="px-3 py-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition cursor-pointer disabled:opacity-50"
            >
              Admin
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onSubmit({ email: "guide@gmail.com", password: "123456" })
              }
              className="px-3 py-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition cursor-pointer disabled:opacity-50"
            >
              Guide
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() =>
                onSubmit({ email: "tourist@gmail.com", password: "123456" })
              }
              className="px-3 py-2 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition cursor-pointer disabled:opacity-50"
            >
              Tourist
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
