"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TourSearchBar from "./searchBar";

const slides = [
  {
    title: "Find Your Perfect Local Guide",
    subtitle: "Discover authentic experiences with verified local guides",
    image: "/hero/Hero1.jpg",
  },
  {
    title: "Explore The World Like a Local",
    subtitle: "Book tours with experts who know hidden gems",
    image: "/hero/Hero2.jpg",
  },
  {
    title: "Travel Smarter, Travel Better",
    subtitle: "Trusted guides. Memorable journeys.",
    image: "/hero/Hero3.jpg",
  },
  {
    title: "Travel Smarter, Travel Better",
    subtitle: "Trusted guides. Memorable journeys.",
    image: "/hero/Hero4.jpg",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    loop: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* ================= BACKGROUND CAROUSEL (IMAGES ONLY) ================= */}
      <div ref={emblaRef} className="absolute inset-0 h-full w-full">
        <div className="flex flex-col h-full">
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full w-full shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
      </div>

      {/* HERO CONTENT  */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6 pt-20 md:pt-0">
        <div className="max-w-3xl text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            {slides[selectedIndex].title}
          </h1>

          <p className="mt-6 text-lg text-white/90">
            {slides[selectedIndex].subtitle}
          </p>
        </div>
        <TourSearchBar />
      </div>

      {/* ================= RIGHT SIDE DOT INDICATORS ================= */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col items-center gap-2 rounded-full  px-2 py-3 ">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => emblaApi?.scrollTo(index)}
              className="relative flex items-center justify-center cursor-pointer"
            >
              {selectedIndex === index ? (
                <span className="h-4 w-4 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300">
                  <span className="h-2 w-2 rounded-full bg-white transition-all duration-300" />
                </span>
              ) : (
                <span className="h-2 w-2 rounded-full bg-white/70 hover:bg-white transition-all duration-300" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
