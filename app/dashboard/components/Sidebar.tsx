"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { BASE_URL } from "@/lib/config";
import { User } from "@/types/user";
import Image from "next/image";
import { getSectionsByRole } from "./sidebarLinks";
import { LogOut } from "lucide-react";

export default function Sidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const sections = getSectionsByRole(user?.data?.role || "");

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="w-72 min-h-screen flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0B0F19] p-6">
      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111827]">
        <Image
          src={user?.data?.profilePic || "/avatar.png"}
          width={50}
          height={50}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-zinc-900 dark:text-white">
            {user?.data?.name} <small>{user?.data?.role}</small>
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Since{" "}
            {user?.data?.tourist?.createdAt
              ? new Date(user.data.tourist.createdAt).toLocaleDateString(
                  "en-US",
                  { day: "2-digit", month: "short", year: "numeric" },
                )
              : "Recently"}
          </p>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-zinc-400 uppercase mb-3">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      group flex items-center justify-between px-4 py-3 rounded-xl
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-red-600 hover:text-white"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout Section */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl
                     bg-red-600 hover:bg-red-700 transition duration-300
                     text-white disabled:opacity-50"
        >
          <LogOut size={18} />
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </aside>
  );
}
