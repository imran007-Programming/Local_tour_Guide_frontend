"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function BreadcrumbBanner() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1] || "dashboard";

  // Check if last segment is a dynamic ID
  const isDynamicRoute = /^[a-f0-9-]{36}$|^\d+$/.test(lastSegment);
  const displaySegments = isDynamicRoute ? segments.slice(0, -1) : segments;

  const formattedSegments = displaySegments.map(
    (segment) => segment.charAt(0).toUpperCase() + segment.slice(1)
  );

  const title = formattedSegments[formattedSegments.length - 1] || "Dashboard";

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          {title}
        </h1>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          <Link
            href="/dashboard"
            className="hover:text-red-500 transition flex items-center gap-1"
          >
            <Home size={12} />
            Home
          </Link>
          {formattedSegments.map((segment, index) => {
            const href = "/" + displaySegments.slice(0, index + 1).join("/");
            const isLast = index === formattedSegments.length - 1;
            return (
              <div key={href} className="flex items-center gap-1.5">
                <ChevronRight size={12} className="text-zinc-300 dark:text-zinc-600" />
                {isLast ? (
                  <span className="text-zinc-900 dark:text-white font-medium">
                    {segment}
                  </span>
                ) : (
                  <Link href={href} className="hover:text-red-500 transition">
                    {segment}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
