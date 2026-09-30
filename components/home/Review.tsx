"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { ReviewSummary } from "@/lib/publicApi";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
          }
        />
      ))}
    </div>
  );
}

export default function Reviews({ reviews: displayed }: { reviews: ReviewSummary[] }) {

  return (
    <section className="border-t border-zinc-200 bg-zinc-50 py-20 md:py-24 dark:border-zinc-900 dark:bg-zinc-900/40">
      <div className="container-page">
        <div className="max-w-xl">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title mt-2">What travellers say</h2>
        </div>

        {displayed.length > 0 ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((review, i) => (
              <motion.figure
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
              >
                <StarRow rating={review.rating} />

                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  “{review.comment}”
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                  <Image
                    src={review.tourist.user.profilePic || "/avatar.png"}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                      {review.tourist.user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {review.booking.tour.title} · {review.booking.tour.city}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-zinc-500">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
