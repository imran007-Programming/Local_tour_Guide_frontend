"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight, Star, Mail, Globe, Briefcase } from "lucide-react";
import { CLIENT_BASE_URL as BASE_URL } from "@/lib/config";
import Link from "next/link";
import { motion } from "framer-motion";

interface Guide {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  languages: string[];
  guide: {
    id: string;
    expertise: string[];
    dailyRate: number;
    _count: { bookings: number; reviews: number };
    averageRating?: number;
    totalReviews?: number;
  };
}

function GuideSkeleton() {
  return (
    <div className="flex-[0_0_280px] md:flex-[0_0_300px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 animate-pulse">
      <div className="h-72 bg-gray-200 dark:bg-zinc-700" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
      </div>
    </div>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  const rating = guide.guide.averageRating ?? 0;
  const reviews = guide.guide.totalReviews ?? 0;
  const [imgSrc, setImgSrc] = useState(guide.profilePic || "/hero/Hero1.jpg");

  return (
    <Link href={`/guides/${guide.name.toLowerCase().replace(/\s+/g, "-")}`} className="flex-[0_0_280px] md:flex-[0_0_300px] group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">

      {/* Image */}
      <div className="relative h-56 overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={guide.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc("/hero/Hero1.jpg")}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

        {/* Daily rate badge */}
        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
          ${guide.guide.dailyRate}/day
        </div>

        {/* Rating badge */}
        {rating > 0 && (
          <div className="absolute top-3 left-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow flex items-center gap-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            {rating.toFixed(1)}
            {reviews > 0 && <span className="text-gray-400 font-normal">({reviews})</span>}
          </div>
        )}

        {/* Name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg leading-tight">{guide.name}</h3>
          <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
            <MapPin size={11} />
            {guide.languages.slice(0, 2).join(", ")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">

        {/* Name */}
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{guide.name}</h3>

        {/* Email */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3 truncate">
          <Mail size={11} className="shrink-0" />
          {guide.email}
        </div>

        {/* Bio */}
        {guide.bio && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">
            {guide.bio}
          </p>
        )}

        {/* Languages */}
        {guide.languages.filter(l => l).length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <Globe size={11} className="shrink-0 text-red-400" />
            <span>{guide.languages.filter(l => l).join(", ")}</span>
          </div>
        )}

        {/* Expertise tags */}
        {guide.guide.expertise.filter(e => e).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {guide.guide.expertise.filter(e => e).slice(0, 4).map((exp, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300"
              >
                {exp}
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-zinc-800 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-400">Bookings</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{guide.guide._count.bookings}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Reviews</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{guide.guide._count.reviews}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Rate</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {guide.guide.dailyRate ? `$${guide.guide.dailyRate}` : "—"}
            </p>
          </div>
        </div>

        {/* View Profile */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-500 group-hover:text-red-600 bg-red-50 dark:bg-red-950/30 group-hover:bg-red-100 dark:group-hover:bg-red-950/50 py-2 rounded-xl transition-colors">
          <Briefcase size={12} /> View Profile <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

export default function TopGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    fetch(`${BASE_URL}/guides`)
      .then(r => r.json())
      .then(data => { setGuides(data.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase">— Meet the Experts</span>
          <h2 className="mt-2 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Our Top <span className="text-red-500">Local Guides</span>
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
            Passionate locals who know every hidden gem in their city.
          </p>
        </motion.div>

        {/* Nav arrows */}
        <div className="flex justify-end gap-3 mb-6">
          <button onClick={scrollPrev} aria-label="Previous"
            className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollNext} aria-label="Next"
            className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-700 dark:text-white hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200">
            <ChevronRight size={20} />
          </button>
          <Link href="/guides"
            className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition group px-2">
            View all
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-8">
            {loading
              ? [...Array(4)].map((_, i) => <GuideSkeleton key={i} />)
              : guides.map(guide => <GuideCard key={guide.id} guide={guide} />)
            }
          </div>
        </div>

      </div>
    </section>
  );
}
