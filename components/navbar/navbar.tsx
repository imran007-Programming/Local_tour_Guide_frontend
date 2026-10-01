"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { ArrowUpRight, MapPin, Menu, X } from "lucide-react";
import SignInModal from "../Auth/Login";
import RegisterModal from "../Auth/Register";
import { logoutAction } from "@/app/actions/logoutAction";
import { clearCurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";
import { BASE_URL } from "@/lib/config";
import NotificationBell from "./NotificationBell";
import PwaInstall from "../PwaInstall";
import { motion, AnimatePresence } from "framer-motion";

type NavLink = { href: string; label: string };

function getLinks(role?: string): NavLink[] {
  const base = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/guides", label: "Guides" },
  ];

  if (role === "TOURIST") {
    return [
      ...base,
      { href: "/dashboard/bookings", label: "Bookings" },
      { href: "/dashboard/wishlist", label: "Wishlist" },
    ];
  }
  if (role === "GUIDE") {
    return [
      ...base,
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/listings", label: "Listings" },
    ];
  }
  if (role === "ADMIN") {
    return [
      ...base,
      { href: "/dashboard", label: "Dashboard" },
      { href: "/dashboard/users", label: "Users" },
    ];
  }
  return base;
}

export default function Navbar() {
  const user = useCurrentUser();
  const authLoaded = user !== undefined;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [guideRegisterOpen, setGuideRegisterOpen] = useState(false);

  const links = getLinks(user?.data?.role);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    clearCurrentUser();
    await logoutAction();
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    const handleOpenSignIn = () => setOpen(true);
    const handleOpenRegister = () => setRegisterOpen(true);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("openSignInModal", handleOpenSignIn);
    window.addEventListener("openAuthModal", handleOpenRegister);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("openSignInModal", handleOpenSignIn);
      window.removeEventListener("openAuthModal", handleOpenRegister);
    };
  }, []);

  // On the home page the bar floats transparently over the hero image
  const onHome = pathname === "/";
  const overHero = onHome && !scrolled && !mobileOpen;

  const iconBtn = overHero
    ? "text-white hover:bg-white/15"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white";

  return (
    <header
      className={`${onHome ? "fixed" : "sticky"} top-0 z-50 w-full border-b transition-colors duration-300 ${
        overHero
          ? "border-transparent bg-transparent"
          : "border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <MapPin
            className={`h-6 w-6 ${overHero ? "fill-white text-blue-500" : "fill-blue-500 text-white dark:text-zinc-950"}`}
            strokeWidth={2.25}
          />
          <span
            className={`font-display text-xl uppercase tracking-wide ${
              overHero ? "text-white" : "text-slate-950 dark:text-white"
            }`}
          >
            TourGuide
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1.5 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  overHero
                    ? active
                      ? "bg-white font-medium text-slate-950 shadow-sm"
                      : "bg-white/15 text-white backdrop-blur-md hover:bg-white/25"
                    : active
                      ? "bg-blue-500 font-medium text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {user?.data && (
            <div className={overHero ? "[&_.lucide-bell]:text-white! [&>div>button]:hover:bg-white/15!" : ""}>
              <NotificationBell />
            </div>
          )}
          <div className="hidden sm:block">
            <PwaInstall />
          </div>
          <AnimatedThemeToggler
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors [&_svg]:size-4.5 ${iconBtn}`}
          />

          <div
            className={`hidden md:flex items-center gap-2 pl-2 transition-opacity ${
              authLoaded ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {user?.data ? (
              <button
                onClick={handleLogout}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${iconBtn}`}
              >
                Log out
              </button>
            ) : (
              <>
                <button
                  onClick={() => setOpen(true)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${iconBtn}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => setGuideRegisterOpen(true)}
                  className={`group inline-flex items-center gap-3 rounded-full py-1.5 pl-4 pr-1.5 text-sm font-medium shadow-sm transition-colors ${
                    overHero
                      ? "bg-white text-slate-950 hover:bg-slate-100"
                      : "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                  }`}
                >
                  Become a guide
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-white transition-transform group-hover:rotate-45">
                    <ArrowUpRight size={15} />
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className={`flex h-9 w-9 items-center justify-center rounded-full md:hidden ${iconBtn}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950"
          >
            <nav className="container-page flex flex-col py-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`border-b border-zinc-100 py-3.5 text-base dark:border-zinc-900 ${
                    isActive(link.href)
                      ? "font-medium text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="container-page flex flex-col gap-2 pb-8 pt-2">
              {user?.data ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full rounded-full border border-zinc-200 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:text-white"
                >
                  Log out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full border border-zinc-200 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:text-white"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      setRegisterOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full border border-zinc-200 py-3 text-sm font-medium text-zinc-900 dark:border-zinc-800 dark:text-white"
                  >
                    Create account
                  </button>
                  <button
                    onClick={() => {
                      setGuideRegisterOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-full bg-blue-500 py-3 text-sm font-medium text-white"
                  >
                    Become a guide
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SignInModal setRegisterOpen={setRegisterOpen} open={open} setOpen={setOpen} />
      <RegisterModal open={registerOpen} setOpen={setRegisterOpen} setLoginOpen={setOpen} />
      <RegisterModal
        open={guideRegisterOpen}
        setOpen={setGuideRegisterOpen}
        setLoginOpen={setOpen}
        defaultRole="GUIDE"
      />
    </header>
  );
}
