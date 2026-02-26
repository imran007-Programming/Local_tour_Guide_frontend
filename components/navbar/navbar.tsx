"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Menu, X, MapPin } from "lucide-react";
import SignInModal from "../Auth/Login";
import { Button } from "../ui/button";
import RegisterModal from "../Auth/Register";
import { User } from "@/types/user";
import { logoutAction } from "@/app/actions/logoutAction";
import { BASE_URL } from "@/lib/config";

export default function Navbar({ user }: { user?: User }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [guideRegisterOpen, setGuideRegisterOpen] = useState(false);

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
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="text-white text-sm">
          <div className="mx-auto max-w-7xl px-6 py-2 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <p className="text-xs sm:text-sm">📞 Toll Free: +1 56565 56594</p>
            <span className="text-xs sm:text-sm">✉️ info@example.com</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`fixed left-0 w-full z-50
          transition-all duration-1000 ease-in-out
          ${
            scrolled
              ? "top-0 dark:bg-black bg-white shadow-md py-4"
              : "top-10 bg-transparent py-4"
          }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className={`text-xl font-bold flex items-center gap-2 transition-colors duration-500 ${
              scrolled ? "text-black dark:text-white" : "text-white"
            }`}
          >
            <MapPin className="text-red-500" size={24} />
            TourGuide
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden  md:flex items-center gap-8 text-sm font-medium">
            <NavItem
              href="/explore"
              label="Explore Tours"
              scrolled={scrolled}
            />

            {user?.data?.role === "TOURIST" && (
              <>
                <NavItem
                  href="/dashboard/bookings"
                  label="My Bookings"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard"
                  label="Profile"
                  scrolled={scrolled}
                />
              </>
            )}

            {user?.data?.role === "GUIDE" && (
              <>
                <NavItem
                  href="/dashboard"
                  label="Dashboard"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard/listings"
                  label="My Listings"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard/profile"
                  label="Profile"
                  scrolled={scrolled}
                />
              </>
            )}

            {user?.data?.role === "ADMIN" && (
              <>
                <NavItem
                  href="/dashboard"
                  label="Admin Dashboard"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard/users"
                  label="Manage Users"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard/listings"
                  label="Manage Listings"
                  scrolled={scrolled}
                />
                <NavItem
                  href="/dashboard/profile"
                  label="Profile"
                  scrolled={scrolled}
                />
              </>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-3">
            <AnimatedThemeToggler />

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <>
                {user?.data ? (
                  <Button
                    className="border rounded-3xl text-center! bg-black hover:bg-[#D4483B] text-white hover:text-white duration-700 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    className="border rounded-3xl text-center! bg-black hover:bg-[#D4483B] text-white hover:text-white duration-700 cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    Sign In
                  </Button>
                )}

                <SignInModal
                  setRegisterOpen={setRegisterOpen}
                  open={open}
                  setOpen={setOpen}
                />
              </>

              <>
                <Button
                  className="border rounded-3xl bg-transparent hover:bg-[#D4483B] text-white hover:text-white duration-700 cursor-pointer"
                  onClick={() => setRegisterOpen(true)}
                >
                  Sign Up
                </Button>

                <RegisterModal
                  open={registerOpen}
                  setOpen={setRegisterOpen}
                  setLoginOpen={setOpen}
                />
              </>

              <button
                onClick={() => setGuideRegisterOpen(true)}
                className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
              >
                Become a Guide
              </button>

              <RegisterModal
                open={guideRegisterOpen}
                setOpen={setGuideRegisterOpen}
                setLoginOpen={setOpen}
                defaultRole="GUIDE"
              />
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
                {/* MENU ITEMS */}
                <Link href="/explore" onClick={() => setMobileOpen(false)}>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-base text-white">Explore Tours</span>
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
              <div className="px-6 pb-6 space-y-4">
                {user?.data ? (
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 rounded-full py-4 text-lg font-semibold"
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
                      className="w-full bg-blue-900 rounded-full py-4 text-lg font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setGuideRegisterOpen(true);
                        setMobileOpen(false);
                      }}
                      className="w-full bg-red-600 rounded-full py-4 text-lg font-semibold"
                    >
                      Become a Guide
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      </div>
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
        className={`transition-colors cursor-pointer duration-500 hover:text-red-500 ${
          scrolled ? "text-black dark:text-white" : "text-white"
        }`}
      >
        {label}
      </button>
    </Link>
  );
}
