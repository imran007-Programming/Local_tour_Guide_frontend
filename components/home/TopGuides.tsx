"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import GuideCard from "@/components/guides/GuideCard";
import type { GuideSummary } from "@/lib/publicApi";
import SectionHeading from "./SectionHeading";

export default function TopGuides({ guides }: { guides: GuideSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-white pb-20 md:pb-28 dark:bg-zinc-950">
      <div className="container-page">
        <SectionHeading
          watermark="Guides"
          title="Meet Our Top Local Guides"
          subtitle="Friendly, verified experts who know their city inside out — and love showing it off."
        />

        <div className="mt-14 overflow-hidden" ref={emblaRef}>
          <div className="-ml-6 flex">
            {guides.map((guide) => (
              <div key={guide.id} className="min-w-0 flex-[0_0_78%] pl-6 sm:flex-[0_0_45%] lg:flex-[0_0_25%]">
                <GuideCard guide={guide} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 78vw" />
              </div>
            ))}
          </div>
        </div>

        {guides.length === 0 ? (
          <p className="py-16 text-center text-slate-500">No guides yet.</p>
        ) : (
          <div className="mt-8 flex items-center justify-between">
            <Link href="/guides" className="btn-pill group">
              View all guides
              <span className="btn-pill-icon">
                <ArrowUpRight size={16} />
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={scrollPrev}
                aria-label="Previous guides"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next guides"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white transition-colors hover:bg-blue-600"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
