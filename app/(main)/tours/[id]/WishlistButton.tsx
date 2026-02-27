"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";

export default function WishlistButton({
  tourId,
  userRole,
  initialInWishlist = false,
}: {
  tourId: string;
  userRole?: string;
  initialInWishlist?: boolean;
}) {
  const [isInWishlist, setIsInWishlist] = useState(initialInWishlist);
  const [wishlistItemId, setWishlistItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkWishlist = async () => {
      if (userRole === "TOURIST") {
        try {
          const res = await authFetch(`${BASE_URL}/tourists/getallwishlist`);
          if (res?.ok) {
            const data = await res.json();
            const wishlistItem = data.data?.find(
              (item: { id: string; tour: { id: string } }) => item.tour?.id === tourId
            );
            if (wishlistItem) {
              setIsInWishlist(true);
              setWishlistItemId(wishlistItem.id);
            } else {
              setIsInWishlist(false);
              setWishlistItemId(null);
            }
          }
        } catch {}
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
      if (isInWishlist && wishlistItemId) {
        const res = await authFetch(
          `${BASE_URL}/tourists/wishlist/${tourId}`,
          {
            method: "DELETE",
          },
        );
        if (res?.ok) {
          setIsInWishlist(false);
          setWishlistItemId(null);
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
        const result = await res.json();
        if (res?.ok) {
          setIsInWishlist(true);
          setWishlistItemId(result.data?.id);
          toast.success("Added to wishlist");
        } else if (result.message === "Duplicate key error") {
          setIsInWishlist(true);
          toast.info("Already in wishlist");
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
