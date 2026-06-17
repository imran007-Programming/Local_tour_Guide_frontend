"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { MapPin, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { User as UserType } from "@/types/user";
import NotificationBell from "@/components/navbar/NotificationBell";
import Image from "next/image";

export default function Header({ user }: { user?: UserType }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={16} />
            </div>
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white hidden sm:block">
              TourGuide
            </h1>
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler />
          <NotificationBell />
          {/* User avatar */}
          <Link
            href="/dashboard/profile"
            className="ml-1 flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Image
              src={user?.data?.profilePic || "/avatar.png"}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden md:block max-w-[100px] truncate">
              {user?.data?.name}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className={`fixed left-0 top-0 h-full w-72 z-50 lg:hidden transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar user={user} onClose={() => setMobileMenuOpen(false)} />
      </div>
    </>
  );
}
