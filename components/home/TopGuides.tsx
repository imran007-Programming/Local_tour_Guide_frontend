"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MapPin, ChevronLeft, ChevronRight, ArrowRight, Star } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

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
    _count: {
      bookings: number;
    };
    averageRating?: number;
    totalReviews?: number;
  };
}

export default function TopGuides() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await fetch(`${BASE_URL}/guides`);
        if (res?.ok) {
          const result = await res.json();
          setGuides(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  return (
    <section className="bg-white text-gray-900 dark:bg-black dark:text-white py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Our <span className="text-red-500">Popular</span> Experts
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some famous tourist guides around the world known for their
            expertise and cultural knowledge.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={scrollPrev}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10
        bg-black/10 dark:bg-white/10
        hover:bg-black/20 dark:hover:bg-white/20
        p-3 rounded-full backdrop-blur transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={scrollNext}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10
        bg-black/10 dark:bg-white/10
        hover:bg-black/20 dark:hover:bg-white/20
        p-3 rounded-full backdrop-blur transition"
          >
            <ChevronRight size={20} />
          </button>

          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-8">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="flex-[0_0_280px] md:flex-[0_0_320px]
              bg-gray-100 dark:bg-zinc-900
              rounded-2xl overflow-hidden
              shadow-md dark:shadow-xl
              hover:shadow-lg dark:hover:shadow-2xl
              transition"
                >
                  <div className="relative h-56">
                    <Image
                      src={guide.profilePic || "/avatar.png"}
                      alt={guide.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold mt-2">
                      {guide.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <MapPin size={14} />
                      {guide.languages.slice(0, 2).join(", ")}
                    </div>

                    {guide.guide.averageRating && guide.guide.totalReviews ? (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= Math.round(guide.guide.averageRating!)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {guide.guide.averageRating.toFixed(1)} ({guide.guide.totalReviews})
                        </span>
                      </div>
                    ) : null}

                    {guide.bio && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                        {guide.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {guide.guide.expertise.slice(0, 3).map((exp, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            idx === 0
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : idx === 1
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                              : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 dark:border-white/10 my-4"></div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Total Bookings
                        </p>
                        <p className="font-semibold">{guide.guide._count.bookings}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Daily Rate
                        </p>
                        <p className="font-semibold">${guide.guide.dailyRate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition"
          >
            View All Guides
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
