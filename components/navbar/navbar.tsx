"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";
import { Menu, X } from "lucide-react";
import SignInModal from "../Auth/Login";
import { Button } from "../ui/button";
import RegisterModal from "../Auth/Register";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";

export default function Navbar({ user }: { user?: User }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [guideRegisterOpen, setGuideRegisterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",

        credentials: "include",
      });
      router.refresh();
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full z-50">
      {/* ================= TOP BAR ================= */}
      <div
        className={`transition-all duration-500 overflow-hidden border-b border-white/10 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"
        }`}
      >
        <div className="text-white text-sm">
          <div className="mx-auto max-w-7xl px-6 py-2 flex justify-between items-center">
            <p>📞 Toll Free: +1 56565 56594</p>
            <span>✉️ info@example.com</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`fixed top-0 left-0 w-full z-50
          transition-colors duration-1000 ease-in-out
          ${
            scrolled
              ? "dark:bg-black bg-white shadow-md py-4"
              : "mt-12 bg-transparent py-4"
          }`}
      >
        <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
          {/* LOGO */}
          <Link
            href="/"
            className={`text-xl font-bold transition-colors duration-500 ${
              scrolled ? "text-black dark:text-white" : "text-white"
            }`}
          >
            🌍 DreamsTour
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden  md:flex items-center gap-8 text-sm font-medium">
            <NavItem href="" label="Explore Tours" scrolled={scrolled} />

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
                <NavItem href="" label="My Listings" scrolled={scrolled} />
                <NavItem href="" label="Profile" scrolled={scrolled} />
              </>
            )}

            {user?.data?.role === "ADMIN" && (
              <>
                <NavItem
                  href="/dashboard"
                  label="Admin Dashboard"
                  scrolled={scrolled}
                />
                <NavItem href="" label="Manage Users" scrolled={scrolled} />
                <NavItem href="" label="Manage Listings" scrolled={scrolled} />
                <NavItem href="" label="Profile" scrolled={scrolled} />
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
                <h2 className="text-lg font-bold">🌍 DreamsTour</h2>

                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600"
                >
                  ✕
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                {/* Wishlist */}
                <div className="flex justify-between items-center bg-zinc-900 rounded-xl px-4 py-4">
                  <span className="text-lg font-medium">Wishlist</span>
                  <div className="relative">
                    ❤️
                    <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-black rounded-full px-1">
                      0
                    </span>
                  </div>
                </div>

                {/* MENU ITEMS */}
                {["Explore", "My Bookings", "Dashboard", "Profile"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex justify-between items-center py-3 border-b border-white/10"
                    >
                      <span
                        className={`text-base ${
                          item === "Home" ? "text-red-500" : "text-white"
                        }`}
                      >
                        {item}
                      </span>
                      <span className="text-xl">+</span>
                    </div>
                  ),
                )}

                {/* LANGUAGE & CURRENCY */}
                <div className="space-y-4 pt-4">
                  <select className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option>🇺🇸 ENG</option>
                    <option>🇧🇩 BN</option>
                  </select>

                  <select className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option>USD</option>
                    <option>BDT</option>
                  </select>
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="px-6 pb-6 space-y-4">
                <button className="w-full bg-blue-900 rounded-full py-4 text-lg font-semibold">
                  Sign In
                </button>

                <button className="w-full bg-red-600 rounded-full py-4 text-lg font-semibold">
                  Become Expert
                </button>
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
