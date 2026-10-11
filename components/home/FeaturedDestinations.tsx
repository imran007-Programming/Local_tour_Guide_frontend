"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import DestinationCard from "@/components/destinations/DestinationCard";
import type { DestinationSummary } from "@/lib/publicApi";
import SectionHeading from "./SectionHeading";

const AUTOPLAY_MS = 3000;

export default function FeaturedDestinations({ destinations }: { destinations: DestinationSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onDown = () => setDragging(true);
    const onUp = () => setDragging(false);
    emblaApi.on("pointerDown", onDown).on("pointerUp", onUp);
    return () => {
      emblaApi.off("pointerDown", onDown).off("pointerUp", onUp);
    };
  }, [emblaApi]);

  // Auto-advance one card at a time. Waits while the pointer is over the cards
  // or they are being dragged, and restarts the timer after every slide change
  // so the arrows never fight it.
  useEffect(() => {
    if (!emblaApi || hovered || dragging) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(() => emblaApi.scrollNext(), AUTOPLAY_MS);
    };
    schedule();
    emblaApi.on("select", schedule);
    return () => {
      clearTimeout(timer);
      emblaApi.off("select", schedule);
    };
  }, [emblaApi, hovered, dragging]);

  if (destinations.length === 0) return null;

  return (
    <section className="bg-white pt-20 md:pt-28 dark:bg-zinc-950">
      <div className="container-page">
        <SectionHeading
          watermark="Destination"
          title="Featured Destinations"
          subtitle="Handpicked places where our local guides are ready to show you around. Choose your next adventure and start making memories today."
        />

        <div
          className="mt-14 overflow-hidden"
          ref={emblaRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="-ml-6 flex">
            {destinations.map((d, i) => (
              <div key={d.slug} className="min-w-0 flex-[0_0_78%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                <DestinationCard
                  d={d}
                  index={i}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 78vw"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link href="/destinations" className="btn-pill group">
            View all {destinations.length} destinations
            <span className="btn-pill-icon">
              <ArrowUpRight size={16} />
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              aria-label="Previous destinations"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <ArrowLeft size={17} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next destinations"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600"
            >
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
