"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TourSearchBar from "./searchBar";

const SLIDE_MS = 6500;

const SLIDES = [
  {
    image: "/images/christoph-schulz-wJ6xyh1YMxU-unsplash.jpg",
    alt: "Snow-covered mountain peaks above the clouds",
    eyebrow: "Discover your next",
    title: "Adventure",
    text: "Explore the world's most breathtaking places with verified local guides who know every side street, hidden view and story worth hearing.",
  },
  {
    image: "/hero/Hero1.jpg",
    alt: "A wooden jetty leading across turquoise water to a tropical island",
    eyebrow: "Find your own slice of",
    title: "Paradise",
    text: "Crystal lagoons, quiet sandbars and island days planned by people who live there.",
  },
  {
    image: "/hero/Hero2.jpg",
    alt: "The Eiffel Tower at sunset above a busy park",
    eyebrow: "Fall in love with",
    title: "Paris",
    text: "Skip the queues and see the city the way locals do, from sunrise bakeries to golden-hour picnics.",
  },
  {
    image: "/hero/Hero3.jpg",
    alt: "Speedboats between green limestone cliffs on emerald water",
    eyebrow: "Set sail for",
    title: "Islands",
    text: "Hop between hidden bays and limestone giants with guides who know the calmest waters.",
  },
  {
    image: "/hero/Hero4.jpg",
    alt: "A traditional houseboat gliding through palm-lined backwaters",
    eyebrow: "Slow down in the",
    title: "Backwaters",
    text: "Drift through misty canals and village life on a journey that sets its own pace.",
  },
];

export default function HeroSection({ categories }: { categories: string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance; restarts whenever the slide changes (also after a manual click)
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => go(index + 1), SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, paused, go]);

  const slide = SLIDES[index];

  return (
    <section aria-label="Hero" className="bg-white p-2 sm:p-3 dark:bg-zinc-950">
      <div
        className="relative isolate flex min-h-160 flex-col items-center overflow-hidden rounded-[1.75rem] px-4 pb-10 pt-28 text-center sm:min-h-180 sm:rounded-[2rem] md:pt-36 lg:min-h-[min(100svh,860px)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* All slides stay mounted and cross-fade, with a slow zoom on the active one */}
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <Image
              key={s.image}
              src={s.image}
              alt={active ? s.alt : ""}
              aria-hidden={!active}
              fill
              priority={i === 0}
              sizes="100vw"
              className="-z-20 object-cover"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "scale(1)" : "scale(1.12)",
                transition: active
                  ? `opacity 1200ms ease, transform ${SLIDE_MS + 1500}ms ease-out`
                  : "opacity 1200ms ease, transform 1200ms ease",
              }}
            />
          );
        })}

        {/* Darken the sky for legible text, fade the base into snow-white */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-slate-950/45 via-slate-900/10 to-white/40 dark:to-zinc-950/60" />

        <div aria-live="polite" className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.55 }}
              className="flex flex-col items-center"
            >
              <p className="text-sm font-medium uppercase tracking-[0.45em] text-white/90 sm:text-lg">
                {slide.eyebrow}
              </p>

              <h1 className="mt-2 font-display text-[19vw] uppercase leading-[0.85] tracking-wide text-white drop-shadow-[0_8px_30px_rgba(2,6,23,0.25)] sm:text-[9.5rem] lg:text-[13rem]">
                {slide.title}
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white drop-shadow sm:text-base">
                {slide.text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-auto flex w-full flex-col items-center gap-6 pt-12">
          {/* Progress indicators: the active bar fills over the slide duration */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 sm:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
              {SLIDES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show slide ${i + 1}: ${s.title}`}
                  onClick={() => go(i)}
                  className="relative h-1.5 w-8 overflow-hidden rounded-full bg-white/35 sm:w-12"
                >
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 rounded-full bg-white"
                      initial={{ width: paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                  {i < index && <span className="absolute inset-0 rounded-full bg-white" />}
                </button>
              ))}
            </div>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/35 sm:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <TourSearchBar categories={categories} />
        </div>
      </div>
    </section>
  );
}
