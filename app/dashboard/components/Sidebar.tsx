"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@/types/user";
import Image from "next/image";
import { getSectionsByRole } from "./sidebarLinks";
import { LogOut, MapPin, X } from "lucide-react";
import { logoutAction } from "@/app/actions/logoutAction";
import { BASE_URL } from "@/lib/config";

export default function Sidebar({
  user,
  onClose,
}: {
  user: User | undefined;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const sections = getSectionsByRole(user?.data?.role || "");

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.history.replaceState(null, "", "/");
    await logoutAction();
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-72 h-full flex flex-col bg-white dark:bg-[#0B0F19] border-r border-zinc-200 dark:border-zinc-800">
      {/* Logo + Close */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <MapPin className="text-white" size={16} />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            TourGuide
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden transition"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* User Card */}
      <div className="px-4 py-4 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
          <Image
            src={user?.data?.profilePic || "/avatar.png"}
            width={40}
            height={40}
            alt="Profile"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {user?.data?.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
              {user?.data?.role?.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <item.icon
                      size={18}
                      className={
                        isActive
                          ? "text-red-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      }
                    />
                    <span>{item.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
