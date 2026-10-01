"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { TourSummary } from "@/lib/publicApi";
import SectionHeading from "./SectionHeading";

const FALLBACKS = ["/hero/Hero1.jpg", "/hero/Hero2.jpg", "/hero/Hero3.jpg"];

type Destination = { city: string; image?: string; tours: number; from: number };

/** One card per city, built from the latest tours. */
function toDestinations(tours: TourSummary[]): Destination[] {
  const byCity = new Map<string, Destination>();
  for (const t of tours) {
    if (!t.city) continue;
    const d = byCity.get(t.city);
    if (d) {
      d.tours += 1;
      d.from = Math.min(d.from, t.price);
      d.image ??= t.images?.[0];
    } else {
      byCity.set(t.city, { city: t.city, image: t.images?.[0], tours: 1, from: t.price });
    }
  }
  return [...byCity.values()].slice(0, 3);
}

function DestinationCard({ d, index }: { d: Destination; index: number }) {
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const [src, setSrc] = useState(d.image || fallback);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/explore?search=${encodeURIComponent(d.city)}`}
        className="group relative block aspect-3/4 overflow-hidden rounded-[1.75rem] bg-slate-100 dark:bg-zinc-900"
      >
        <Image
          src={src}
          alt={d.city}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setSrc(fallback)}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-950 transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight size={18} />
        </span>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="text-3xl font-semibold tracking-tight text-white">{d.city}</h3>
          <p className="mt-2 text-sm text-white/85">
            {d.tours} {d.tours === 1 ? "tour" : "tours"} with local guides · from ${d.from}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedDestinations({ tours }: { tours: TourSummary[] }) {
  const destinations = toDestinations(tours);
  if (destinations.length === 0) return null;

  return (
    <section className="bg-white pt-20 md:pt-28 dark:bg-zinc-950">
      <div className="container-page">
        <SectionHeading
          watermark="Destination"
          title="Featured Destinations"
          subtitle="Handpicked places where our local guides are ready to show you around. Choose your next adventure and start making memories today."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <DestinationCard key={d.city} d={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
