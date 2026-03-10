"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "@/types/user";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { Heart, MapPin, Clock, Users, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const res = await authFetch(`${BASE_URL}/tourists/wishlist/${tourId}`, {
      method: "DELETE",
    });

    if (res?.ok) {
      setWishlist((prev) => prev.filter((item) => item.tour.id !== tourId));
      toast.success("Removed from wishlist");
    } else {
      toast.error("Failed to remove from wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="border-red-500" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Your wishlist is empty
        </p>
        <Link href="/">
          <Button className="mt-4">Explore Tours</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
          <Link href={`/tours/${item.tour.slug}`}>
            <div className="relative h-48">
              <Image
                src={item.tour.images[0] || "/placeholder.jpg"}
                alt={item.tour.title}
                fill
                className="object-cover"
              />
            </div>
          </Link>

          <div className="p-4 space-y-3">
            <Link href={`/tours/${item.tour.slug}`}>
              <h3 className="font-bold text-lg hover:text-red-600 dark:text-white dark:hover:text-red-400 transition">
                {item.tour.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.tour.description}
            </p>

            <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {item.tour.city}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {item.tour.duration}h
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {item.tour.maxGroupSize}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${item.tour.price}
              </span>
              <button
                onClick={() => removeFromWishlist(item.tour.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded-full transition"
                title="Remove from wishlist"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
