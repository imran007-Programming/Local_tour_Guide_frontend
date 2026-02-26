"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Bell, User, MapPin, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { User as UserType } from "@/types/user";

export default function Header({ user }: { user?: UserType }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="h-16 border-b dark:bg-black bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="text-red-500" size={24} />
            <h1 className="text-xl font-semibold">TourGuide</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <AnimatedThemeToggler />
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <Bell size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-500 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 lg:hidden transform transition-transform duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar user={user} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
}
