"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Menu, X, MapPin, ArrowRight } from "lucide-react";
import SignInModal from "../Auth/Login";
import RegisterModal from "../Auth/Register";
import { User } from "@/types/user";
import { logoutAction } from "@/app/actions/logoutAction";
import { BASE_URL } from "@/lib/config";
import NotificationBell from "./NotificationBell";
import PwaInstall from "../PwaInstall";
import { motion } from "framer-motion";

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
        className={`transition-all duration-500 overflow-hidden border-b border-white/10 ${
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
        className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
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

            {/* MOBILE HAMBURGER */}
            <button
              className={`md:hidden ${
                scrolled ? "text-black dark:text-white" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= FULL SCREEN MOBILE DRAWER ================= */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
            mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-black text-white z-50
            transform transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="text-red-500" size={20} />
                TourGuide
              </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-base text-white">Home</span>
                </div>
              </Link>
              <Link href="/explore" onClick={() => setMobileOpen(false)}>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-base text-white">Explore Tours</span>
                </div>
              </Link>
              <Link href="/guides" onClick={() => setMobileOpen(false)}>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-base text-white">Guides</span>
                </div>
              </Link>

              {user?.data?.role === "TOURIST" && (
                <>
                  <Link href="/dashboard/bookings" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">My Bookings</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/wishlist" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Wishlist</span>
                    </div>
                  </Link>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Profile</span>
                    </div>
                  </Link>
                </>
              )}

              {user?.data?.role === "GUIDE" && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Dashboard</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/listings" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">My Listings</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Profile</span>
                    </div>
                  </Link>
                </>
              )}

              {user?.data?.role === "ADMIN" && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Admin Dashboard</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/users" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Manage Users</span>
                    </div>
                  </Link>
                  <Link href="/dashboard/listings" onClick={() => setMobileOpen(false)}>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-base text-white">Manage Listings</span>
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* FOOTER BUTTONS */}
            <div className="px-6 pb-6 space-y-2.5">
              {user?.data ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 rounded-full py-2 text-xs font-semibold hover:bg-red-700 transition"
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
                    className="w-full bg-blue-900 rounded-full py-2 text-xs font-semibold hover:bg-blue-800 transition"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setRegisterOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full bg-gray-700 rounded-full py-2 text-xs font-semibold hover:bg-gray-600 transition"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setGuideRegisterOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full bg-red-600 rounded-full py-2 text-xs font-semibold hover:bg-red-700 transition"
                  >
                    Become a Guide
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </>

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
