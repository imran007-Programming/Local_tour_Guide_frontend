"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { ArrowUpRight, MapPin } from "lucide-react";
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

  // Close the menu on navigation and on Escape
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll when the menu is open
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

          {/* Menu toggle: the three bars morph into a cross */}
          <button
            className={`relative ml-1 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${iconBtn}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={mobileOpen ? { y: 0, rotate: 45 } : { y: -6, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="absolute h-0.5 w-5 rounded-full bg-current"
              animate={mobileOpen ? { y: 0, rotate: -45 } : { y: 6, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
            />
          </button>
        </div>
      </div>

      {/* Menu: slides down from the bar and shows everything */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 top-16 -z-10 bg-slate-950/40 backdrop-blur-sm md:top-20"
            />
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto rounded-b-3xl border-b border-slate-200/80 bg-white shadow-2xl shadow-slate-950/10 md:max-h-[calc(100dvh-5rem)] dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="container-page grid gap-8 py-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:py-10">
                <nav className="flex flex-col">
                  {links.map((link, i) => {
                    const active = isActive(link.href);
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05, duration: 0.35, ease: "easeOut" }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`group flex items-center justify-between border-b border-slate-100 py-4 text-2xl font-semibold tracking-tight transition-colors md:text-3xl dark:border-zinc-900 ${
                            active
                              ? "text-blue-500"
                              : "text-slate-950 hover:text-blue-500 dark:text-white dark:hover:text-blue-400"
                          }`}
                        >
                          {link.label}
                          <ArrowUpRight
                            size={22}
                            className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + links.length * 0.05, duration: 0.35, ease: "easeOut" }}
                  className={`flex flex-col justify-center gap-3 transition-opacity ${
                    authLoaded ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {user?.data ? (
                    <>
                      <p className="text-sm text-slate-500 dark:text-zinc-400">
                        Signed in as{" "}
                        <span className="font-medium text-slate-950 dark:text-white">
                          {user.data.name ?? user.data.email}
                        </span>
                      </p>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                        className="w-full rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setOpen(true);
                          setMobileOpen(false);
                        }}
                        className="w-full rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
                      >
                        Sign in
                      </button>
                      <button
                        onClick={() => {
                          setRegisterOpen(true);
                          setMobileOpen(false);
                        }}
                        className="w-full rounded-full border border-slate-200 py-3 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
                      >
                        Create account
                      </button>
                      <button
                        onClick={() => {
                          setGuideRegisterOpen(true);
                          setMobileOpen(false);
                        }}
                        className="btn-pill group w-full justify-between"
                      >
                        Become a guide
                        <span className="btn-pill-icon">
                          <ArrowUpRight size={16} />
                        </span>
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
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
