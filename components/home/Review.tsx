"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, Quote } from "lucide-react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";

interface Review {
  id: string;
  rating: number;
  comment: string;
  tourist: {
    user: {
      name: string;
      profilePic: string | null;
    };
  };
  booking: {
    tour: {
      title: string;
      city: string;
    };
  };
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={13}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-300 dark:text-zinc-600"
          }
        />
      ))}
    </div>
  );
}

const cardColors = [
  "bg-white dark:bg-zinc-900",
  "bg-red-500",
  "bg-white dark:bg-zinc-900",
  "bg-zinc-900 dark:bg-zinc-800",
  "bg-white dark:bg-zinc-900",
  "bg-amber-400",
];

const textColors = [
  "text-gray-700 dark:text-zinc-300",
  "text-white",
  "text-gray-700 dark:text-zinc-300",
  "text-zinc-300",
  "text-gray-700 dark:text-zinc-300",
  "text-zinc-900",
];

const nameColors = [
  "text-gray-900 dark:text-white",
  "text-white",
  "text-gray-900 dark:text-white",
  "text-white",
  "text-gray-900 dark:text-white",
  "text-zinc-900",
];

const subColors = [
  "text-gray-400",
  "text-white/70",
  "text-gray-400",
  "text-zinc-400",
  "text-gray-400",
  "text-zinc-700",
];

const dividerColors = [
  "border-gray-100 dark:border-zinc-800",
  "border-white/20",
  "border-gray-100 dark:border-zinc-800",
  "border-zinc-700",
  "border-gray-100 dark:border-zinc-800",
  "border-zinc-800/20",
];

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await authFetch(`${BASE_URL}/reviews`, { cache: "no-store" });
      if (res?.ok) {
        const data = await res.json();
        setReviews(data.data || []);
      }
    };
    fetchReviews();
  }, []);

  const displayed = reviews.slice(0, 6);

  return (
    <section className="bg-zinc-950 dark:bg-zinc-950 py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-red-500">
            ✦ Testimonials
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Loved by <span className="text-red-500">travelers</span> worldwide
          </h2>
          <p className="mt-4 text-gray-500 dark:text-zinc-400 max-w-xl mx-auto text-sm">
            Thousands of happy travelers have shared their experiences with our local guides.
          </p>
        </motion.div>

        {/* Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayed.map((review, i) => {
              const bg = cardColors[i % cardColors.length];
              const text = textColors[i % textColors.length];
              const name = nameColors[i % nameColors.length];
              const sub = subColors[i % subColors.length];
              const divider = dividerColors[i % dividerColors.length];
              const isColored = i === 1 || i === 3 || i === 5;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className={`rounded-2xl p-6 shadow-sm ${bg}`}
                  role="article"
                  aria-label={`Review by ${review.tourist.user.name}`}
                >
                  {/* Quote icon */}
                  <Quote
                    size={24}
                    className={`mb-3 ${isColored ? "text-white/30" : "text-red-100 dark:text-zinc-700"}`}
                    aria-hidden="true"
                  />

                  {/* Stars */}
                  <div className="mb-3">
                    {isColored ? (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={13}
                            className={
                              s <= Math.round(review.rating)
                                ? "fill-white text-white"
                                : "text-white/30"
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <StarRow rating={review.rating} />
                    )}
                  </div>

                  {/* Comment */}
                  <p className={`text-sm leading-relaxed ${text}`}>
                    "{review.comment}"
                  </p>

                  {/* Tour title */}
                  <p className={`mt-2 text-xs font-semibold truncate ${isColored ? "text-white/60" : "text-red-400"}`}>
                    {review.booking.tour.title}
                  </p>

                  {/* Divider */}
                  <div className={`my-4 border-t ${divider}`} aria-hidden="true" />

                  {/* Reviewer */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={review.tourist.user.profilePic || "/avatar.png"}
                      alt={`${review.tourist.user.name}'s profile picture`}
                      width={38}
                      height={38}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                      quality={75}
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate ${name}`}>
                        {review.tourist.user.name}
                      </p>
                      <p className={`text-xs truncate ${sub}`}>
                        📍 {review.booking.tour.city}
                      </p>
                    </div>
                    <span className={`ml-auto text-lg font-black shrink-0 ${isColored ? "text-white/30" : "text-gray-100 dark:text-zinc-800"}`}>
                      {review.rating.toFixed(1)}
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-20">No reviews yet.</p>
        )}

      </div>
    </section>
  );
}
