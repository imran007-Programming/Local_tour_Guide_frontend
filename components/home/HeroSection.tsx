"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import TourSearchBar from "./searchBar";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80";

const avatars = ["/hero/Hero1.jpg", "/hero/Hero2.jpg", "/hero/Hero3.jpg", "/hero/Hero4.jpg"];

export default function HeroSection({ categories }: { categories: string[] }) {
  return (
    <section aria-label="Hero" className="bg-white dark:bg-zinc-950">
      <div className="container-page grid items-center gap-12 pb-20 pt-12 md:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-28">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <BadgeCheck size={14} className="text-red-500" />
            Verified local guides in 50+ destinations
          </span>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.1] text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
            Travel like a local,
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">with people who live there.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            Find a guide who knows the side streets, the best food and the stories behind
            every corner. Book in minutes.
          </p>

          <TourSearchBar categories={categories} />

          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-2">
              {avatars.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-zinc-950"
                />
              ))}
            </div>
            <div className="text-sm">
              <div className="flex items-center gap-1 font-medium text-zinc-900 dark:text-white">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                4.9 average rating
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">from 2,500+ travellers</p>
            </div>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative hidden aspect-4/3 overflow-hidden rounded-3xl bg-zinc-100 sm:block lg:aspect-4/5 dark:bg-zinc-900"
        >
          <Image
            src={HERO_IMAGE}
            alt="Traveller walking through a historic city with a local guide"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-white/95 px-4 py-3 backdrop-blur dark:bg-zinc-900/95">
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">Old City Walking Tour</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">3 hours · Small group</p>
            </div>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">from $29</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
