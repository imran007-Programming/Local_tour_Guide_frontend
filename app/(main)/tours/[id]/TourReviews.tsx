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
        <Spinner size="md" className="text-zinc-400" />
      </div>
    );
  }

  const average =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return (
    <div>
      <h2 className="flex items-center gap-2 text-xl font-semibold text-zinc-900 dark:text-white">
        {reviews.length > 0 && (
          <>
            <Star size={18} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
            {average.toFixed(1)}
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
          </>
        )}
        {reviews.length} review{reviews.length === 1 ? "" : "s"}
      </h2>

      {reviews.length === 0 ? (
        <p className="mt-4 text-zinc-500 dark:text-zinc-400">
          No reviews yet. Travellers who complete this tour can leave the first one.
        </p>
      ) : (
        <div className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id}>
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={review?.tourist?.user?.profilePic || "/avatar.png"}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {review?.tourist?.user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={
                      star <= review.rating
                        ? "fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white"
                        : "fill-zinc-200 text-zinc-200 dark:fill-zinc-800 dark:text-zinc-800"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      )}

      {/* Write a review (tourists only) */}
      {userRole === "TOURIST" && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-5 rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
        >
          <h3 className="font-semibold text-zinc-900 dark:text-white">Write a review</h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Your booking
            </label>
            <Select value={bookingId} onValueChange={setBookingId}>
              <SelectTrigger className="h-11 w-full rounded-lg border-zinc-200 dark:border-zinc-800">
                <SelectValue placeholder="Select a completed booking" />
              </SelectTrigger>
              <SelectContent>
                {userBookings.map((booking) => (
                  <SelectItem key={booking.id} value={booking.id}>
                    Booking on {new Date(booking.bookingDateTime).toLocaleDateString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {userBookings.length === 0 && (
              <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                You can review this tour after a completed booking.
              </p>
            )}
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-zinc-900 dark:text-zinc-100">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="rounded p-0.5"
                >
                  <Star
                    size={22}
                    className={
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="mb-1.5 block text-sm font-medium text-zinc-900 dark:text-zinc-100"
            >
              Comment
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What was the highlight of your tour?"
              rows={4}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-60 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {submitting ? (
              <>
                <Spinner size="sm" />
                Submitting…
              </>
            ) : (
              "Submit review"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
