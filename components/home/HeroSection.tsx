"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import TourSearchBar from "./searchBar";

const slides = [
  {
    title: "Find Your Perfect Local Guide",
    subtitle: "Discover authentic experiences with verified local guides",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Explore The World Like a Local",
    subtitle: "Book tours with experts who know hidden gems",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Travel Smarter, Travel Better",
    subtitle: "Trusted guides. Memorable journeys.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Adventure Awaits You",
    subtitle: "Create unforgettable memories with local experts.",
    image: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1920&q=80",
  },
  {
    title: "Your Journey Starts Here",
    subtitle: "Connect with passionate local guides",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1920&q=80",
  },
];

export default function HeroSection() {
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

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="relative h-[90vh] overflow-hidden" aria-label="Hero section with tour carousel">
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
                sizes="100vw"
                quality={75}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}
        </div>
      </div>

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

      <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 z-20" role="group" aria-label="Slide navigation">
        <div className="flex flex-col items-center gap-2 rounded-full px-2 py-3">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1} of ${slides.length}: ${slides[index].title}`}
              aria-current={selectedIndex === index ? "true" : "false"}
              onClick={() => emblaApi?.scrollTo(index)}
              className="relative flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded-full"
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
