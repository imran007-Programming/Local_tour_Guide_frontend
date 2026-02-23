"use client";

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Bell, User } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 border-b dark:bg-black bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <AnimatedThemeToggler />
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <User size={20} />
        </button>
      </div>
    </header>
  );
}
