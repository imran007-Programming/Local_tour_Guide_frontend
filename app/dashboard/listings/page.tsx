import Link from "next/link";
import { Plus, MapPin, Clock, Users, Eye } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import Image from "next/image";
import { Tour } from "@/types/tours";

async function getTours() {
  const res = await fetch(`${BASE_URL}/tour`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function ListingsPage() {
  const tours = await getTours();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Tour Listings
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {tours.length} tour{tours.length !== 1 ? "s" : ""} available
          </p>
        </div>
        <Link
          href="/dashboard/listings/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
        >
          <Plus size={16} />
          Create Tour
        </Link>
      </div>

      {/* Grid */}
      {tours.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
            <MapPin size={28} className="text-zinc-400" />
          </div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-white">
            No tours yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create your first tour listing to get started
          </p>
          <Link
            href="/dashboard/listings/create"
            className="mt-5 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition"
          >
            Create Tour
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tours.map((tour: Tour) => {
            const slug = tour.title
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^\w-]+/g, "");
            return (
              <Link
                key={tour.id}
                href={`/dashboard/listings/${slug}`}
                className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={tour.images[0] || "/placeholder.jpg"}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                        tour.isActive
                          ? "bg-emerald-500/90 text-white"
                          : "bg-zinc-800/80 text-zinc-300"
                      }`}
                    >
                      {tour.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {/* Price */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">
                      ${tour.price}
                    </span>
                    <span className="text-xs text-zinc-500"> /person</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-1">
                    {tour.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {tour.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {tour.duration}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {tour.maxGroupSize}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
