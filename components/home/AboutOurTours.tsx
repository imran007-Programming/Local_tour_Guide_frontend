"use client";

import Image from "next/image";
import Link from "next/link";
import aboutImage from "@/public/images/chris-karidis-nnzkZNYWHaU-unsplash.jpg";
import { motion } from "framer-motion";
import { ShieldCheck, Headphones, MapPin, ArrowDownRight, ArrowUpRight } from "lucide-react";
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
    <section className="bg-white py-20 md:py-28 dark:bg-zinc-950">
      <div className="container-page">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-4/3 overflow-hidden rounded-[2rem] bg-slate-100 lg:aspect-square dark:bg-zinc-900"
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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-950 dark:bg-zinc-900 dark:text-white">
              Why travel with us
              <ArrowDownRight size={15} />
            </span>
            <h2 className="display-title mt-6 text-5xl sm:text-6xl">
              More than a
              <br />
              checklist
            </h2>
            <p className="mt-5 leading-relaxed text-slate-600 dark:text-zinc-400">
              We connect you with passionate local experts who turn a trip into a story —
              personal, unhurried and genuinely local.
            </p>

            <ul className="mt-8 space-y-6">
              {features.map((f) => (
                <li key={f.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <f.icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-950 dark:text-white">{f.title}</h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/explore" className="btn-pill group">
                Explore tours
                <span className="btn-pill-icon">
                  <ArrowUpRight size={16} />
                </span>
              </Link>
              <Link
                href="/guides"
                className="text-sm font-medium text-slate-950 underline-offset-4 hover:underline dark:text-white"
              >
                Meet our guides
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl bg-slate-100/70 p-6 dark:bg-zinc-900">
              <p className="bg-linear-to-r from-sky-400 to-blue-600 bg-clip-text font-display text-5xl tracking-wide text-transparent sm:text-6xl">
                <NumberTicker value={s.value} className="tracking-wide text-transparent dark:text-transparent" />+
              </p>
              <p className="mt-2 text-sm font-medium text-slate-600 dark:text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
