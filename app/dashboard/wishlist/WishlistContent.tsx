"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { Heart, MapPin, Clock, Users, Trash2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WishlistItem {
  id: string;
  tour: {
    id: string;
    slug: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    city: string;
    maxGroupSize: number;
    images: string[];
  };
}

export default function WishlistContent({ user }: { user: User }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await authFetch(`${BASE_URL}/tourists/getallwishlist`, {
        cache: "no-store",
      });

      if (res?.ok) {
        const result = await res.json();
        setWishlist(result.data || []);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (tourId: string) => {
    setRemovingId(tourId);
    const res = await authFetch(`${BASE_URL}/tourists/wishlist/${tourId}`, {
      method: "DELETE",
    });

    if (res?.ok) {
      setWishlist((prev) => prev.filter((item) => item.tour.id !== tourId));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove from wishlist");
    }
    setRemovingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-5">
          <Heart className="h-10 w-10 text-red-300 dark:text-red-700" />
        </div>
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Your wishlist is empty
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          Start exploring tours and save your favorites here for later
        </p>
        <Link
          href="/explore"
          className="mt-5 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition"
        >
          Explore Tours
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      <AnimatePresence>
        {wishlist.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300"
          >
            {/* Image */}
            <Link href={`/tours/${item.tour.slug}`}>
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={item.tour.images[0] || "/placeholder.jpg"}
                  alt={item.tour.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Price badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg">
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    ${item.tour.price}
                  </span>
                  <span className="text-xs text-zinc-500"> /person</span>
                </div>
              </div>
            </Link>

            {/* Content */}
            <div className="p-4 space-y-3">
              <Link href={`/tours/${item.tour.slug}`}>
                <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-1">
                  {item.tour.title}
                </h3>
              </Link>

              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {item.tour.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {item.tour.duration}h
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  Max {item.tour.maxGroupSize}
                </span>
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                {item.tour.description}
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <Link
                  href={`/tours/${item.tour.slug}`}
                  className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline"
                >
                  View Details →
                </Link>
                <button
                  onClick={() => removeFromWishlist(item.tour.id)}
                  disabled={removingId === item.tour.id}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition disabled:opacity-50"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
