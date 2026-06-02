"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const routeImages: Record<string, string> = {
  dashboard: "/images/chris-karidis-nnzkZNYWHaU-unsplash.jpg",
  bookings: "/images/christoph-schulz-wJ6xyh1YMxU-unsplash.jpg",
  tours: "/images/humphrey-m-TejFa7VW5e4-unsplash.jpg",
  users: "/images/nopparuj-lamaikul-v7bDIi2eBTI-unsplash.jpg",
  earnings: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
  wishlist: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
  reviews: "https://images.unsplash.com/photo-1552581234-26160f608093",
  settings: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
  profile: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  explore: "https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg",
  listings: "https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg",
};

export default function BreadcrumbBanner() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const lastSegment = segments[segments.length - 1] || "dashboard";
  const secondLastSegment = segments[segments.length - 2];

  // Check if last segment is a dynamic ID (UUID pattern or numeric)
  const isDynamicRoute = /^[a-f0-9-]{36}$|^\d+$/.test(lastSegment);

  // Use second last segment if current is dynamic, otherwise use last segment
  const routeKey = isDynamicRoute ? secondLastSegment : lastSegment;

  const bgImage =
    routeImages[routeKey?.toLowerCase()] ||
    "https://images.pexels.com/photos/753339/pexels-photo-753339.jpeg";

  const formattedSegments = segments.map(
    (segment) => segment.charAt(0).toUpperCase() + segment.slice(1),
  );

  const title = formattedSegments[formattedSegments.length - 1] || "Dashboard";

  return (
    <div
      className="relative h-56 w-full flex items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full text-white space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>

        <div className="flex items-center justify-center gap-2 text-sm text-zinc-200">
          <Home size={16} />

          {formattedSegments.map((segment, index) => {
            const href = "/" + segments.slice(0, index + 1).join("/");

            return (
              <div key={href} className="flex items-center gap-2">
                <ChevronRight size={14} />
                <Link href={href} className="hover:text-red-400 transition">
                  {segment}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
