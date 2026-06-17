"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { MapPin, ArrowRight } from "lucide-react";
import SignInModal from "../Auth/Login";
import RegisterModal from "../Auth/Register";
import { User } from "@/types/user";
import { logoutAction } from "@/app/actions/logoutAction";
import { BASE_URL } from "@/lib/config";
import NotificationBell from "./NotificationBell";
import PwaInstall from "../PwaInstall";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ user }: { user?: User }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [guideRegisterOpen, setGuideRegisterOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    await logoutAction();
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    const handleOpenSignIn = () => {
      setOpen(true);
    };

    const handleOpenRegister = () => {
      setRegisterOpen(true);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("openSignInModal", handleOpenSignIn);
    window.addEventListener("openAuthModal", handleOpenRegister);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("openSignInModal", handleOpenSignIn);
      window.removeEventListener("openAuthModal", handleOpenRegister);
    };
  }, []);

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      {/* ================= TOP BAR ================= */}
      <div
        className={`transition-all duration-[800ms] ease-in-out overflow-hidden border-b border-white/10 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-auto opacity-100"
        }`}
      >
        <div className="text-white text-sm bg-black/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-3 flex flex-row justify-center sm:justify-between items-center gap-3 sm:gap-0">
            <p className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
              📞 +1 56565 56594
            </p>
            <span className="text-[11px] sm:text-xs md:text-sm whitespace-nowrap">
              ✉️ info@example.com
            </span>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-[900ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          scrolled
            ? "top-4 w-[92%] max-w-5xl bg-white dark:bg-zinc-900 shadow-xl shadow-black/10 dark:shadow-black/30 rounded-full py-3 px-6 border border-gray-200 dark:border-zinc-700"
            : "top-10 sm:top-12 w-full max-w-7xl bg-transparent py-4 px-4 sm:px-6 rounded-none border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className={`text-lg sm:text-xl font-bold flex items-center gap-2 transition-colors duration-500 ${
              scrolled ? "text-black dark:text-white" : "text-white"
            }`}
          >
            <MapPin className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">TourGuide</span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <NavItem href="/" label="Home" scrolled={scrolled} />
            <NavItem href="/explore" label="Explore" scrolled={scrolled} />
            <NavItem href="/guides" label="Guides" scrolled={scrolled} />

            {user?.data?.role === "TOURIST" && (
              <>
                <NavItem href="/dashboard/bookings" label="Bookings" scrolled={scrolled} />
                <NavItem href="/dashboard" label="Profile" scrolled={scrolled} />
              </>
            )}

            {user?.data?.role === "GUIDE" && (
              <>
                <NavItem href="/dashboard" label="Dashboard" scrolled={scrolled} />
                <NavItem href="/dashboard/listings" label="Listings" scrolled={scrolled} />
                <NavItem href="/dashboard/profile" label="Profile" scrolled={scrolled} />
              </>
            )}

            {user?.data?.role === "ADMIN" && (
              <>
                <NavItem href="/dashboard" label="Dashboard" scrolled={scrolled} />
                <NavItem href="/dashboard/users" label="Users" scrolled={scrolled} />
                <NavItem href="/dashboard/listings" label="Listings" scrolled={scrolled} />
              </>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user?.data && <NotificationBell />}
            <PwaInstall />
            <AnimatedThemeToggler />

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <>
                {user?.data ? (
                  <motion.button
                    onMouseEnter={() => setHoveredButton("logout")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={handleLogout}
                    className="relative px-5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full" />
                    <motion.div
                      animate={{ scaleX: hoveredButton === "logout" ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 bg-red-700 rounded-full origin-right"
                    />
                    <span className="relative text-white">Logout</span>
                  </motion.button>
                ) : (
                  <motion.button
                    onMouseEnter={() => setHoveredButton("signin")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => setOpen(true)}
                    className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-black dark:bg-white rounded-full" />
                    <motion.div
                      animate={{ scaleX: hoveredButton === "signin" ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 bg-red-500 rounded-full origin-right"
                    />
                    <span className="relative text-white dark:text-black font-semibold">
                      Sign In
                    </span>
                  </motion.button>
                )}

                <SignInModal
                  setRegisterOpen={setRegisterOpen}
                  open={open}
                  setOpen={setOpen}
                />
              </>

              {!user?.data && (
                <>
                  <motion.button
                    onMouseEnter={() => setHoveredButton("guide")}
                    onMouseLeave={() => setHoveredButton(null)}
                    onClick={() => setGuideRegisterOpen(true)}
                    className="relative px-5 py-1.5 text-sm font-medium text-white rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <div className="absolute inset-0 bg-red-500 rounded-full" />
                    <motion.div
                      animate={{ scaleX: hoveredButton === "guide" ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="absolute inset-0 bg-black rounded-full origin-right"
                    />
                    <div className="relative flex items-center gap-1.5">
                      <span>Become a Guide</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight size={14} />
                      </motion.div>
                    </div>
                  </motion.button>

                  <RegisterModal
                    open={guideRegisterOpen}
                    setOpen={setGuideRegisterOpen}
                    setLoginOpen={setOpen}
                    defaultRole="GUIDE"
                  />
                </>
              )}
            </div>

            {/* MOBILE HAMBURGER - Animated */}
            <button
              className={`md:hidden relative w-8 h-8 flex items-center justify-center ${
                scrolled ? "text-black dark:text-white" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] origin-center ${
                    scrolled ? "bg-black dark:bg-white" : "bg-white"
                  } ${mobileOpen ? "rotate-45 translate-y-[9px]" : "rotate-0 translate-y-0"}`}
                />
                <span
                  className={`block h-[2px] rounded-full transition-all duration-300 ease-in-out ${
                    scrolled ? "bg-black dark:bg-white" : "bg-white"
                  } ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`}
                />
                <span
                  className={`block h-[2px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)] origin-center ${
                    scrolled ? "bg-black dark:bg-white" : "bg-white"
                  } ${mobileOpen ? "-rotate-45 -translate-y-[9px]" : "rotate-0 translate-y-0"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ================= FULL SCREEN MOBILE MENU (Top to Bottom) ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 bg-black z-40 md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-8 pb-8">
              {/* NAVIGATION LINKS - Staggered */}
              <nav className="flex-1 flex flex-col justify-center space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/explore", label: "Explore Tours" },
                  { href: "/guides", label: "Guides" },
                  ...(user?.data?.role === "TOURIST"
                    ? [
                        { href: "/dashboard/bookings", label: "My Bookings" },
                        { href: "/dashboard/wishlist", label: "Wishlist" },
                        { href: "/dashboard", label: "Profile" },
                      ]
                    : []),
                  ...(user?.data?.role === "GUIDE"
                    ? [
                        { href: "/dashboard", label: "Dashboard" },
                        { href: "/dashboard/listings", label: "My Listings" },
                        { href: "/dashboard/profile", label: "Profile" },
                      ]
                    : []),
                  ...(user?.data?.role === "ADMIN"
                    ? [
                        { href: "/dashboard", label: "Admin Dashboard" },
                        { href: "/dashboard/users", label: "Manage Users" },
                        { href: "/dashboard/listings", label: "Manage Listings" },
                      ]
                    : []),
                ].map((item, index) => (
                  <motion.div
                    key={item.href + item.label}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 + index * 0.08,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 border-b border-white/10 group"
                    >
                      <span className="text-white text-xl font-medium inline-block transition-all duration-300 group-hover:translate-x-3 group-hover:text-red-400">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* FOOTER BUTTONS - Staggered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-3 pt-6"
              >
                {user?.data ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full bg-red-600 rounded-full py-3 text-sm font-semibold text-white hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-white text-black rounded-full py-3 text-sm font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setRegisterOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-zinc-800 text-white rounded-full py-3 text-sm font-semibold hover:bg-zinc-700 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => {
                        setGuideRegisterOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-red-600 text-white rounded-full py-3 text-sm font-semibold hover:bg-red-700 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      Become a Guide
                    </button>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Register modal (for Sign Up from mobile) */}
      <RegisterModal
        open={registerOpen}
        setOpen={setRegisterOpen}
        setLoginOpen={setOpen}
      />
    </header>
  );
}

function NavItem({
  label,
  scrolled,
  href,
}: {
  label: string;
  scrolled: boolean;
  href: string;
}) {
  return (
    <Link href={href}>
      <button
        className={`px-3 py-1.5 rounded-full transition-all duration-500 cursor-pointer text-sm ${
          scrolled
            ? "text-gray-700 dark:text-gray-200 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-white/10"
            : "text-white/90 hover:text-white hover:bg-white/10"
        }`}
      >
        {label}
      </button>
    </Link>
  );
}
