"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Users, Star, ArrowRight, UserCircle } from "lucide-react";
import { CLIENT_BASE_URL as BASE_URL } from "@/lib/config";

interface Tour {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration: number;
  city: string;
  category: string;
  images: string[];
  maxGroupSize: number;
  averageRating?: number;
  reviewCount?: number;
  guide?: {
    user?: {
      name?: string;
    };
  };
}

const FALLBACKS = [
  "/hero/Hero1.jpg",
  "/hero/Hero2.jpg",
  "/hero/Hero3.jpg",
  "/hero/Hero4.jpg",
];

function TourSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow overflow-hidden">
      <div className="h-52 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse w-2/3" />
        <div className="h-6 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse w-1/3 mt-2" />
      </div>
    </div>
  );
}

function TourCard({ tour, index }: { tour: Tour; index: number }) {
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const [imgSrc, setImgSrc] = useState<string>(tour.images?.[0] || fallback);

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/tours/${tour.slug}`} className="group flex h-full">
        <div className="flex flex-col w-full bg-white dark:bg-zinc-900 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          {/* Image */}
          <div className="relative shrink-0 overflow-hidden" style={{ height: '220px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={tour.title}
              className="block w-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ height: '220px', width: '100%' }}
              loading="lazy"
              onError={() => setImgSrc(fallback)}
            />
            {tour.category && (
              <span className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 text-gray-800 dark:text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                {tour.category.charAt(0) + tour.category.slice(1).toLowerCase()}
              </span>
            )}
            <span className="absolute top-3 right-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
              ${tour.price}
            </span>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
              {tour.title}
            </h3>

            {(tour.averageRating ?? 0) > 0 && (
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={
                      s <= Math.round(tour.averageRating!)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"
                    }
                  />
                ))}
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  {tour.averageRating!.toFixed(1)}
                  {tour.reviewCount ? ` (${tour.reviewCount})` : ""}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {tour.city}
              </span>
              {tour.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={13} /> {tour.duration}h
                </span>
              )}
              {tour.maxGroupSize && (
                <span className="flex items-center gap-1">
                  <Users size={13} /> Max {tour.maxGroupSize}
                </span>
              )}
            </div>

            {tour.guide?.user?.name && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <UserCircle size={14} />
                <span>Guide: <span className="font-medium text-gray-700 dark:text-gray-300">{tour.guide.user.name}</span></span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-zinc-800 mt-auto">
              <div>
                <span className="text-xl font-extrabold text-red-600">${tour.price}</span>
                <span className="text-xs text-gray-400 ml-1">/ person</span>
              </div>
              <span className="text-xs font-semibold text-red-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                Book Now <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${BASE_URL}/tour?limit=6&sortBy=createdAt&sortOrder=desc`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        console.log("Tour list API response (first item):", data.data?.[0]);
        setTours(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="py-20 bg-zinc-950 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-3 items-start mb-10"
        >
          <div />

          <div className="text-center">
            <span className="text-red-500 text-sm font-semibold tracking-widest uppercase">
              — Featured Tours
            </span>
            <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Top Picks <span className="text-red-500">For You</span>
            </h2>
            <p className="mt-3 pb-4 text-gray-500 dark:text-gray-400 max-w-lg text-sm">
              Hand-selected tours loved by travellers — book yours today.
            </p>
          </div>

          <div className="flex justify-end">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 transition group shrink-0"
            >
              View all tours
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <TourSkeleton key={i} />)}
          </div>
        ) : tours.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No tours available yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        )}

        {!loading && tours.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg"
            >
              Explore All Tours
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
