"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { DestinationSummary } from "@/lib/publicApi";

const FALLBACKS = ["/hero/Hero1.jpg", "/hero/Hero2.jpg", "/hero/Hero3.jpg", "/hero/Hero4.jpg"];

export default function DestinationCard({
  d,
  index,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: {
  d: DestinationSummary;
  index: number;
  sizes?: string;
}) {
  const fallback = FALLBACKS[index % FALLBACKS.length];
  const [src, setSrc] = useState(d.image || fallback);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      // Stagger per row, not across the whole list
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
    >
      <Link
        href={`/destinations/${d.slug}`}
        className="group relative block aspect-3/4 overflow-hidden rounded-[1.75rem] bg-slate-100 dark:bg-zinc-900"
      >
        <Image
          src={src}
          alt={d.city}
          fill
          sizes={sizes}
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
