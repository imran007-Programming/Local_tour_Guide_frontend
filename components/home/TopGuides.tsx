"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import Image from "next/image";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const experts = [
  {
    name: "Connie Allen",
    location: "Tokyo, Japan",
    rating: 4.9,
    reviews: 315,
    listings: 21,
    price: 689,
    image: "/experts/expert1.jpg",
  },
  {
    name: "Ida Olsen",
    location: "Cape Town, South Africa",
    rating: 4.7,
    reviews: 220,
    listings: 15,
    price: 230,
    image: "/experts/expert2.jpg",
  },
  {
    name: "Damien Martien",
    location: "Sydney, Australia",
    rating: 5.0,
    reviews: 180,
    listings: 15,
    price: 563,
    image: "/experts/expert3.jpg",
  },
  {
    name: "Catalina Schmeling",
    location: "Oslo, Norway",
    rating: 4.9,
    reviews: 160,
    listings: 17,
    price: 550,
    image: "/experts/expert4.jpg",
  },
];

export default function PopularExperts() {
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

  return (
    <section className="bg-white text-gray-900 dark:bg-black dark:text-white py-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">
            Our <span className="text-red-500">Popular</span> Experts
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Here are some famous tourist places around the world known for their
            historical significance and cultural impact.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Arrows */}
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
              {experts.map((expert, index) => (
                <div
                  key={index}
                  className="min-w-[280px] md:min-w-[320px]
              bg-gray-100 dark:bg-zinc-900
              rounded-2xl overflow-hidden
              shadow-md dark:shadow-xl
              hover:shadow-lg dark:hover:shadow-2xl
              transition"
                >
                  {/* Image */}
                  <div className="relative h-56">
                    <Image
                      src={expert.image}
                      alt={expert.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star size={14} className="text-yellow-400" />
                      {expert.rating} ({expert.reviews} Reviews)
                    </div>

                    <h3 className="text-xl font-semibold mt-2">
                      {expert.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                      <MapPin size={14} />
                      {expert.location}
                    </div>

                    <div className="border-t border-gray-200 dark:border-white/10 my-4"></div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Total Listings
                        </p>
                        <p className="font-semibold">{expert.listings}</p>
                      </div>

                      <div>
                        <p className="text-gray-500 dark:text-gray-400">
                          Starts From
                        </p>
                        <p className="font-semibold">${expert.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Button */}
        <div className="text-center mt-16">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition">
            View All Experts
          </button>
        </div>
      </div>
    </section>
  );
}
