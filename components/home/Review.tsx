"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
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

const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    duration: 50,
  });

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await authFetch(`${BASE_URL}/reviews`, { cache: "no-store" });

      if (res?.ok) {
        const data = await res.json();
        console.log(data.data);
        setReviews(data.data || []);
      }
    };
    fetchReviews();
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-24 bg-gray-100 dark:bg-zinc-900 transition-colors duration-300">
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6"
      >
        {/* Heading */}
        <motion.div variants={childVariant} className="text-center">
          <h2 className="text-4xl font-bold dark:text-white">
            What’s Our <span className="text-red-500 underline">User</span> Says
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            DreamsTour, a tour operator specializing in dream destinations,
            offers a variety of benefits for travelers.
          </p>
        </motion.div>

        {/* ===== Embla Carousel ===== */}
        <motion.div variants={childVariant} className="mt-16">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review) => (
                <div key={review.id} className="flex-[0_0_360px] px-4">
                  <div className="h-[320px] bg-white dark:bg-zinc-800 shadow-lg p-8 transition">
                    <h3 className="font-semibold text-lg dark:text-white">
                      {review.booking.tour.title}
                    </h3>

                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4">
                      {review.comment}
                    </p>

                    <div className="border-t border-gray-200 dark:border-zinc-700 my-6"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={review.tourist.user.profilePic || "/avatar.png"}
                          alt={review.tourist.user.name}
                          width={40}
                          height={40}
                          className="object-cover rounded-full"
                        />
                        <div>
                          <p className="font-semibold dark:text-white">
                            {review.tourist.user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.booking.tour.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= Math.round(review.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="font-semibold dark:text-white">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Arrows */}
          <div className="flex justify-center gap-6 mt-12">
            <button
              onClick={scrollPrev}
              className="bg-black/80 hover:bg-black text-white p-4 transition shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={scrollNext}
              className="bg-red-600 hover:bg-red-700 text-white p-4 transition shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
