"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";

export default function WishlistButton({
  tourId,
  userRole,
}: {
  tourId: string;
  userRole?: string;
}) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (userRole === "TOURIST") {
        const res = await authFetch(`${BASE_URL}/tourists/wishlist`);
        if (res?.ok) {
          const data = await res.json();
          const inWishlist = data.data?.some((item: any) => item.tour.id === tourId);
          setIsInWishlist(inWishlist);
        }
      }
    };
    checkWishlist();
  }, [tourId, userRole]);

  const toggleWishlist = async () => {
    if (!userRole) {
      const event = new CustomEvent("openSignInModal");
      window.dispatchEvent(event);
      return;
    }

    if (userRole !== "TOURIST") {
      toast.error("Only tourists can add to wishlist");
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        const res = await authFetch(`${BASE_URL}/tourists/wishlist/${tourId}`, {
          method: "DELETE",
        });
        if (res?.ok) {
          setIsInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error("Failed to remove from wishlist");
        }
      } else {
        const res = await authFetch(`${BASE_URL}/tourists/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tourId }),
        });
        if (res?.ok) {
          setIsInWishlist(true);
          toast.success("Added to wishlist");
        } else {
          toast.error("Failed to add to wishlist");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50"
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          isInWishlist
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
    </button>
  );
}
