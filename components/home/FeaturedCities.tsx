"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BASE_URL } from "@/lib/config";

interface Tour {
  _id: string;
  title: string;
  city: string;
  images: string[];
  price: number;
  slug: string;
}

// Section animation
const sectionVariant: Variants = {
  hidden: { opacity: 0, y: 100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const childVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function FeaturedCities() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    duration: 80,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch(`${BASE_URL}/tour`)
      .then((res) => res.json())
      .then((data) => {
        setTours(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(selectedIndex - 2);
  }, [emblaApi, selectedIndex]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(selectedIndex + 2);
  }, [emblaApi, selectedIndex]);

  const handleClick = (slug: string) => {
    router.push(`/tours/${slug}`);
  };

  return (
    <section className="dark:bg-black bg-white py-24">
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6"
      >
        {/* Heading */}
        <motion.div variants={childVariant} className="text-center">
          <h2 className="text-3xl font-bold dark:text-white">
            Search by{" "}
            <span className="text-red-500 underline">Destinations</span> Around
            the World
          </h2>

          <p className="mt-4 text-gray-600 dark:text-gray-400">
            DreamsTour Marketplace is a platform designed to connect fans with
            exclusive experiences related to a specific tour
          </p>
        </motion.div>

        {/* ===== Carousel ===== */}
        <motion.div variants={childVariant} className="relative mt-12">
          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {loading ? (
                <p className="text-gray-600 dark:text-gray-400">
                  Loading tours...
                </p>
              ) : tours.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No tours available
                </p>
              ) : (
                tours.map((tour) => (
                  <motion.div
                    key={tour._id}
                    whileHover={{ scale: 1.05 }}
                    className="relative h-82
                    min-w-70
                    flex-[0_0_100%]
                    sm:flex-[0_0_50%]
                    lg:flex-[0_0_25%]
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    shadow-lg"
                    onClick={() => handleClick(tour.slug)}
                  >
                    <Image
                      src={tour.images[0] || "/placeholder.jpg"}
                      alt={tour.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition" />

                    <div className="absolute bottom-6 left-6">
                      <h3 className="text-xl font-semibold text-white">
                        {tour.title}
                      </h3>
                      <p className="mt-1 text-sm text-white/80">
                        ${tour.price}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2
            bg-black/50 hover:bg-black
            text-white p-3 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2
            bg-black/50 hover:bg-black
            text-white p-3 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
