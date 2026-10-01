"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import type { ReviewSummary } from "@/lib/publicApi";
import SectionHeading from "./SectionHeading";

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={17}
          className={
            s <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200 dark:fill-zinc-700 dark:text-zinc-700"
          }
        />
      ))}
    </div>
  );
}

export default function Reviews({ reviews: displayed }: { reviews: ReviewSummary[] }) {
  return (
    <section className="bg-white pb-28 pt-20 md:pb-36 md:pt-28 dark:bg-zinc-950">
      <div className="container-page">
        <SectionHeading
          watermark="Testimonial"
          title="What Our Clients Say"
          subtitle="Hear what our happy travellers have to say about their unforgettable journeys with local guides."
        >
          <Link href="/explore" className="btn-pill group mt-8">
            Find your tour
            <span className="btn-pill-icon">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </SectionHeading>

        {displayed.length > 0 ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((review, i) => (
              // middle column sits lower, like a masonry wall
              <div key={review.id} className={i % 3 === 1 ? "lg:translate-y-14" : ""}>
                <motion.figure
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
                  className="flex h-full flex-col rounded-3xl bg-slate-100/80 p-6 dark:bg-zinc-900"
                >
                  <StarRow rating={review.rating} />

                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-800 dark:text-zinc-300">
                    “{review.comment}”
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3">
                    <Image
                      src={review.tourist.user.profilePic || "/avatar.png"}
                      alt=""
                      width={44}
                      height={44}
                      className="h-11 w-11 shrink-0 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-950 dark:text-white">
                        {review.tourist.user.name}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-zinc-400">
                        {review.booking.tour.title}
                        {review.booking.tour.city && `, ${review.booking.tour.city}`}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-slate-500">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
