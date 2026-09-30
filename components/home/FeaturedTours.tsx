"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import type { TourSummary } from "@/lib/publicApi";

const FALLBACKS = [
  "/hero/Hero1.jpg",
  "/hero/Hero2.jpg",
  "/hero/Hero3.jpg",
  "/hero/Hero4.jpg",
];

export function TourCard({ tour, index }: { tour: TourSummary; index: number }) {
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const [imgSrc, setImgSrc] = useState<string>(tour.images?.[0] || fallback);
  const rating = tour.averageRating ?? 0;

  const meta = [
    tour.city,
    tour.duration ? `${tour.duration}h` : null,
    tour.maxGroupSize ? `Up to ${tour.maxGroupSize}` : null,
  ].filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/tours/${tour.slug}`} className="group block">
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={imgSrc}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={() => setImgSrc(fallback)}
          />
          {tour.category && (
            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-medium text-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-200">
              {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-medium text-zinc-900 dark:text-white">{tour.title}</h3>
          {rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              <Star size={13} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{meta.join(" · ")}</p>
        {tour.guide?.user?.name && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">with {tour.guide.user.name}</p>
        )}

        <p className="mt-2 text-sm text-zinc-900 dark:text-white">
          <span className="font-semibold">${tour.price}</span>
          <span className="text-zinc-500 dark:text-zinc-400"> / person</span>
        </p>
      </Link>
    </motion.div>
  );
}

export default function FeaturedTours({ tours }: { tours: TourSummary[] }) {
  return (
    <section className="bg-white py-20 md:py-24 dark:bg-zinc-950">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured tours</p>
            <h2 className="section-title mt-2">Popular right now</h2>
          </div>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white"
          >
            View all tours
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {tours.length === 0 ? (
          <p className="py-20 text-center text-zinc-500">No tours available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
