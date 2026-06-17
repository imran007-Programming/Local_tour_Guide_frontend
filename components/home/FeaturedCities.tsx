"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Star, ArrowRight } from "lucide-react";
import { CLIENT_BASE_URL as BASE_URL } from "@/lib/config";

const FALLBACKS = [
  "/hero/Hero1.jpg",
  "/hero/Hero2.jpg",
  "/hero/Hero3.jpg",
  "/hero/Hero4.jpg",
];

interface Tour {
  id: string;
  title: string;
  city: string;
  images: string[];
  price: number;
  slug: string;
  duration?: number;
  category?: string;
  averageRating?: number;
  reviewCount?: number;
}

function TourSlide({ tour, idx, onNav }: { tour: Tour; idx: number; onNav: (slug: string) => void }) {
  const [imgSrc, setImgSrc] = useState<string>(tour.images?.[0] || FALLBACKS[idx % FALLBACKS.length]);

  return (
    <div className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 pl-5">
      <div
        onClick={() => onNav(tour.slug)}
        className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={tour.title}
          className="block w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={() => setImgSrc(FALLBACKS[idx % FALLBACKS.length])}
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

        {tour.category && (
          <span className="absolute top-3 left-3 bg-white/20 backdrop-blur text-white text-xs font-medium px-2.5 py-1 rounded-full border border-white/25">
            {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
          </span>
        )}

        <span className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
          ${tour.price}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          {(tour.averageRating ?? 0) > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  className={
                    s <= Math.round(tour.averageRating!)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-white/30 text-white/30"
                  }
                />
              ))}
              <span className="text-white/70 text-xs ml-1">
                {tour.averageRating!.toFixed(1)}
                {tour.reviewCount ? ` (${tour.reviewCount})` : ""}
              </span>
            </div>
          )}

          <h3 className="text-white font-bold text-base leading-snug line-clamp-2 mb-1.5">
            {tour.title}
          </h3>

          <div className="flex items-center gap-3 text-white/70 text-xs">
            <span className="flex items-center gap-1">
              <MapPin size={11} /> {tour.city}
            </span>
            {tour.duration && (
              <span className="flex items-center gap-1">
                <Clock size={11} /> {tour.duration}h
              </span>
            )}
          </div>

          <div className="mt-3 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300">
            <div className="flex items-center justify-center gap-1.5 bg-white text-gray-900 text-xs font-semibold py-2 rounded-lg">
              View Tour <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedCities() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BASE_URL}/tour?limit=100`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setTours(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-gray-50 dark:bg-zinc-950 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
            — Featured Tours
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Top Picks <span className="text-red-500">For You</span>
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
            Hand-selected tours loved by travellers — book yours today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex justify-center items-center gap-3 mb-6"
        >
          <button
            onClick={scrollPrev}
            aria-label="Previous"
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Next"
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm"
          >
            <ChevronRight size={22} />
          </button>
          <Link
            href="/explore"
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition group px-2"
          >
            View all
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {loading
                ? [...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] xl:flex-[0_0_25%] min-w-0 pl-5"
                    >
                      <div className="h-96 rounded-2xl bg-gray-200 dark:bg-zinc-800 animate-pulse" />
                    </div>
                  ))
                : tours.length === 0
                ? (
                    <p className="pl-5 text-gray-500 dark:text-gray-400">
                      No tours available
                    </p>
                  )
                : tours.map((tour, idx) => (
                    <TourSlide
                      key={tour.id}
                      tour={tour}
                      idx={idx}
                      onNav={(slug) => router.push(`/tours/${slug}`)}
                    />
                  ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
