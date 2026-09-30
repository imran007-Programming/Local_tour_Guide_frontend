"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, CalendarCheck, Compass } from "lucide-react";

const steps = [
  {
    Icon: Search,
    title: "Search a tour",
    description: "Browse unique tours by destination, category or date.",
  },
  {
    Icon: UserCheck,
    title: "Choose a guide",
    description: "Pick a verified local guide based on ratings and expertise.",
  },
  {
    Icon: CalendarCheck,
    title: "Book instantly",
    description: "Select your date and pay securely online in minutes.",
  },
  {
    Icon: Compass,
    title: "Enjoy the journey",
    description: "Meet your guide and see the city the way locals do.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-y border-zinc-200 bg-zinc-50 py-20 md:py-24 dark:border-zinc-900 dark:bg-zinc-900/40">
      <div className="container-page">
        <div className="max-w-xl">
          <p className="eyebrow">How it works</p>
          <h2 className="section-title mt-2">From idea to adventure in four steps</h2>
        </div>

        <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="border-t border-zinc-300 pt-6 dark:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <step.Icon className="h-5 w-5 text-zinc-900 dark:text-white" strokeWidth={1.75} />
                <span className="text-sm tabular-nums text-zinc-400 dark:text-zinc-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-medium text-zinc-900 dark:text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
