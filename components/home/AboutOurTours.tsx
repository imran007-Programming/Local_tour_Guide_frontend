"use client";

import Image from "next/image";
import Link from "next/link";
import aboutImage from "@/public/images/chris-karidis-nnzkZNYWHaU-unsplash.jpg";
import { motion } from "framer-motion";
import { ShieldCheck, Headphones, MapPin, ArrowRight } from "lucide-react";
import { NumberTicker } from "../ui/number-ticker";

const stats = [
  { label: "Destinations", value: 50 },
  { label: "Tours completed", value: 7000 },
  { label: "Happy clients", value: 100 },
  { label: "Verified guides", value: 89 },
];

const features = [
  {
    icon: ShieldCheck,
    title: "Verified guides",
    desc: "Every guide is background-checked, trained and rated by real travellers.",
  },
  {
    icon: Headphones,
    title: "Support around the clock",
    desc: "We are here before, during and after your trip.",
  },
  {
    icon: MapPin,
    title: "Real local knowledge",
    desc: "Experiences crafted by people who truly know their city.",
  },
];

export default function AboutSection() {
  return (
    <section className="bg-white py-20 md:py-24 dark:bg-zinc-950">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-4/3 overflow-hidden rounded-3xl bg-zinc-100 lg:aspect-square dark:bg-zinc-900"
          >
            <Image
              src={aboutImage}
              alt="Travellers exploring a city"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <div>
            <p className="eyebrow">About us</p>
            <h2 className="section-title mt-2">Built for travellers who want more than a checklist</h2>
            <p className="mt-5 leading-relaxed text-zinc-600 dark:text-zinc-400">
              We connect you with passionate local experts who turn a trip into a story —
              personal, unhurried and genuinely local.
            </p>

            <ul className="mt-8 space-y-6">
              {features.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <f.icon className="size-4.5 text-zinc-900 dark:text-white" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-medium text-zinc-900 dark:text-white">{f.title}</h3>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Explore tours
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/guides"
                className="text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
              >
                Meet our guides
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-y-10 border-t border-zinc-200 pt-10 md:grid-cols-4 dark:border-zinc-800">
          {stats.map((s) => (
            <div key={s.label} className="md:border-l md:border-zinc-200 md:pl-6 md:first:border-l-0 md:first:pl-0 dark:md:border-zinc-800">
              <p className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                <NumberTicker value={s.value} className="tracking-tight text-zinc-900 dark:text-white" />+
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
