"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import GuideCard from "@/components/guides/GuideCard";
import type { GuideSummary } from "@/lib/publicApi";

const arrowClass =
  "flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900";

export default function TopGuides({ guides }: { guides: GuideSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="border-t border-zinc-200 bg-white py-20 md:py-24 dark:border-zinc-900 dark:bg-zinc-950">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Meet the experts</p>
            <h2 className="section-title mt-2">Top local guides</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/guides"
              className="mr-2 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
            >
              View all
            </Link>
            <button onClick={scrollPrev} aria-label="Previous guides" className={arrowClass}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={scrollNext} aria-label="Next guides" className={arrowClass}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 flex">
            {guides.map((guide) => (
              <div key={guide.id} className="min-w-0 flex-[0_0_78%] pl-6 sm:flex-[0_0_45%] lg:flex-[0_0_25%]">
                <GuideCard guide={guide} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw" />
              </div>
            ))}
          </div>
        </div>

        {guides.length === 0 && (
          <p className="py-16 text-center text-zinc-500">No guides yet.</p>
        )}
      </div>
    </section>
  );
}
