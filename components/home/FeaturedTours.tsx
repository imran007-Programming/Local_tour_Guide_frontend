"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import type { TourSummary } from "@/lib/publicApi";
import SectionHeading from "./SectionHeading";

const FALLBACKS = [
  "/hero/Hero1.jpg",
  "/hero/Hero2.jpg",
  "/hero/Hero3.jpg",
  "/hero/Hero4.jpg",
];

const formatCategory = (c: string) => c.charAt(0) + c.slice(1).toLowerCase();

export function TourCard({ tour, index }: { tour: TourSummary; index: number }) {
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const [imgSrc, setImgSrc] = useState<string>(tour.images?.[0] || fallback);
  const rating = tour.averageRating ?? 0;

  const details = [
    tour.duration ? `${tour.duration} hour${tour.duration > 1 ? "s" : ""} experience` : null,
    tour.maxGroupSize ? `Small group, up to ${tour.maxGroupSize} people` : null,
    tour.category ? `${formatCategory(tour.category)} tour` : null,
    tour.guide?.user?.name ? `Hosted by ${tour.guide.user.name}` : null,
  ].filter(Boolean);

  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-3 transition-shadow hover:shadow-xl hover:shadow-slate-950/5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800">
        <Image
          src={imgSrc}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          quality={90}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={() => setImgSrc(fallback)}
        />
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-950 dark:text-white">
            {tour.title}
            {tour.city && <span className="font-normal text-slate-500 dark:text-zinc-400">, {tour.city}</span>}
          </h3>
          {rating > 0 && (
            <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-slate-700 dark:text-zinc-300">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <ul className="mt-3 space-y-1.5 text-[13px] text-slate-600 dark:text-zinc-400">
          {details.map((d) => (
            <li key={d} className="flex items-center gap-2">
              <span className="h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span className="line-clamp-1">{d}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">per person</p>
            <p className="text-xl font-semibold text-slate-950 dark:text-white">${tour.price}</p>
          </div>
          <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-medium text-white transition-colors group-hover:bg-blue-500 dark:bg-white dark:text-slate-950 dark:group-hover:bg-blue-500 dark:group-hover:text-white">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedTours({ tours }: { tours: TourSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start" });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  useEffect(() => {
    if (!emblaApi) return;
    const sync = () => {
      setSnaps(emblaApi.scrollSnapList());
      setSelected(emblaApi.selectedScrollSnap());
    };
    sync();
    emblaApi.on("select", sync).on("reInit", sync);
    return () => {
      emblaApi.off("select", sync).off("reInit", sync);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <div className="container-page">
        <SectionHeading
          watermark="Packages"
          title="Popular Tour Packages"
          subtitle="The latest experiences from our guides — small groups, local insight and fair prices."
        />

        {tours.length === 0 ? (
          <p className="py-20 text-center text-slate-500">No tours available yet.</p>
        ) : (
          <>
            <div className="mt-14 overflow-hidden" ref={emblaRef}>
              <div className="-ml-6 flex">
                {tours.map((tour, i) => (
                  <div key={tour.id} className="min-w-0 flex-[0_0_86%] pl-6 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                    <TourCard tour={tour} index={i} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {snaps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === selected ? "w-8 bg-blue-500" : "w-1.5 bg-slate-300 dark:bg-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/explore"
                  className="mr-2 hidden text-sm font-medium text-slate-950 underline-offset-4 hover:underline sm:inline dark:text-white"
                >
                  View all tours
                </Link>
                <button
                  onClick={scrollPrev}
                  aria-label="Previous tours"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  onClick={scrollNext}
                  aria-label="Next tours"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600"
                >
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
