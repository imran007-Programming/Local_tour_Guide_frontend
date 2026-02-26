"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/config";
import { authFetch } from "@/lib/authFetch";
import Image from "next/image";
import { Star } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  tourist: {
    user: {
      name: string;
      profilePic: string | null;
    };
  };
}

interface Booking {
  id: string;
  bookingDateTime: string;
  status: string;
  tour: {
    id: string;
  };
}

export default function TourReviews({
  tourId,
  userRole,
}: {
  tourId: string;
  userRole?: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${BASE_URL}/reviews/tour/${tourId}`);
        if (res?.ok) {
          const result = await res.json();
          setReviews(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBookings = async () => {
      if (userRole === "TOURIST") {
        try {
          const res = await authFetch(`${BASE_URL}/bookings/me`);
          if (res?.ok) {
            const result = await res.json();

            const completedBookings = result.data.data.filter(
              (b: Booking) => b.tour.id === tourId && b.status === "COMPLETED",
            );
            setUserBookings(completedBookings);
          }
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        }
      }
    };

    fetchReviews();
    fetchUserBookings();
  }, [tourId, userRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) {
      toast.error("Please enter your booking ID");
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      if (res?.ok) {
        const result = await res.json();
        setReviews([result.data, ...reviews]);
        setComment("");
        setBookingId("");
        setRating(5);
        toast.success("Review submitted successfully!");
      } else {
        const error = await res?.json();
        toast.error(error?.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reviews ({reviews.length})</h2>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review?.tourist?.user?.profilePic || "/avatar.png"}
                    alt={review?.tourist?.user?.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">
                      {review?.tourist?.user?.name}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Review Form - Only for Tourists */}
      {userRole === "TOURIST" && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg space-y-4"
        >
          <h3 className="text-lg font-semibold">Write a Review</h3>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Your Booking
            </label>
            <Select value={bookingId} onValueChange={setBookingId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a completed booking" />
              </SelectTrigger>
              <SelectContent>
                {userBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id}>
                    Booking on{" "}
                    {new Date(booking.bookingDateTime).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userBookings.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                You need a completed booking to leave a review
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="border-white" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
