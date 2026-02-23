"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  {
    title: "Easy to Find your Leisure Place",
    text: "Thanks for arranging a smooth travel experience for us. Our cab driver was polite, timely, and helpful. The team ensured making it a stress-free trip.",
    name: "Prajakta Sasane",
    location: "Paris, France",
    rating: 5.0,
    image: "/reviews/user1.jpg",
  },
  {
    title: "Fantastic Family Experience",
    text: "We had a fantastic time as a family. There were activities for every age group, and the kids loved the fun experiences and great hospitality.",
    name: "James Andrew",
    location: "New York, United States",
    rating: 4.9,
    image: "/reviews/user2.jpg",
  },
  {
    title: "Great Hospitality",
    text: "Dream Tours is the only way to go. We had the time of our life on our trip. The customer service was wonderful & the staff was very helpful.",
    name: "Andrew Fetcher",
    location: "Los Angeles, United States",
    rating: 5.0,
    image: "/reviews/user3.jpg",
  },
  {
    title: "Smooth Booking Process",
    text: "The booking experience was seamless and transparent. Everything was well organized, and we received constant updates throughout the trip.",
    name: "Sophia Martinez",
    location: "Barcelona, Spain",
    rating: 4.8,
    image: "/reviews/user4.jpg",
  },
  {
    title: "Highly Recommended",
    text: "From airport pickup to hotel arrangements, everything was handled professionally. I would definitely recommend Dream Tours to my friends.",
    name: "Daniel Kim",
    location: "Seoul, South Korea",
    rating: 4.9,
    image: "/reviews/user5.jpg",
  },
  {
    title: "Memorable Adventure",
    text: "This was one of the best adventures of my life. The guides were knowledgeable, friendly, and always ready to help.",
    name: "Emma Thompson",
    location: "Sydney, Australia",
    rating: 5.0,
    image: "/reviews/user6.jpg",
  },
  {
    title: "Exceptional Support",
    text: "Customer support was available whenever we needed assistance. Their response time was impressive and very reassuring.",
    name: "Mohammed Ali",
    location: "Dubai, UAE",
    rating: 4.7,
    image: "/reviews/user7.jpg",
  },
  {
    title: "Well Organized Tours",
    text: "Every tour was well structured and informative. We never felt rushed, and we had enough time to explore each destination.",
    name: "Olivia Brown",
    location: "London, UK",
    rating: 4.8,
    image: "/reviews/user8.jpg",
  },
  {
    title: "Luxury Experience",
    text: "The accommodations were luxurious and comfortable. The entire journey felt premium and thoughtfully curated.",
    name: "Lucas Schneider",
    location: "Berlin, Germany",
    rating: 5.0,
    image: "/reviews/user9.jpg",
  },
  {
    title: "Unforgettable Trip",
    text: "Our honeymoon trip was unforgettable thanks to Dream Tours. Everything exceeded our expectations.",
    name: "Isabella Rossi",
    location: "Rome, Italy",
    rating: 4.9,
    image: "/reviews/user10.jpg",
  },
];

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
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
    duration: 50,
  });

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
              {reviews.map((review, index) => (
                <div key={index} className="flex-[0_0_360px] px-4">
                  <div
                    className="
            h-[320px]
            bg-white
            dark:bg-zinc-800
            shadow-lg
            p-8
            transition
          "
                  >
                    <h3 className="font-semibold text-lg dark:text-white">
                      {review.title}
                    </h3>

                    <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-4">
                      {review.text}
                    </p>

                    <div className="border-t border-gray-200 dark:border-zinc-700 my-6"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={review.image}
                          alt={review.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                        <div>
                          <p className="font-semibold dark:text-white">
                            {review.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {review.location}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold dark:text-white">
                        {review.rating}
                      </span>
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
