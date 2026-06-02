"use client";

import { motion } from "framer-motion";
import { Search, UserCheck, CalendarCheck, Compass, ArrowRight } from "lucide-react";

const steps = [
  {
    Icon: Search,
    title: "Search a Tour",
    description: "Browse unique tours by destination, category, or date.",
    num: "01",
    color: "#14b8a6",
  },
  {
    Icon: UserCheck,
    title: "Choose a Guide",
    description: "Pick a verified local guide based on ratings and expertise.",
    num: "02",
    color: "#f43f5e",
  },
  {
    Icon: CalendarCheck,
    title: "Book Instantly",
    description: "Select your date and pay securely online in minutes.",
    num: "03",
    color: "#eab308",
  },
  {
    Icon: Compass,
    title: "Enjoy the Journey",
    description: "Meet your guide and enjoy an unforgettable adventure.",
    num: "04",
    color: "#22c55e",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#7c3aed", transform: "translate(-40%, -40%)" }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "#8b5cf6", transform: "translate(40%, 40%)" }} />

      <div className="relative mx-auto max-w-7xl px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase">— How It Works</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
            Your Adventure in{" "}
            <span className="text-red-500">4 Steps</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            From discovery to adventure — booking your perfect tour takes just minutes.
          </p>
        </motion.div>

        {/* Glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group relative rounded-2xl p-6 flex flex-col gap-5 border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-xl cursor-pointer overflow-hidden"
              style={{ transition: "box-shadow 0.3s ease, border-color 0.3s ease" }}
            >
              {/* Animated color fill from bottom on hover */}
              <div
                className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-2xl pointer-events-none z-0"
                style={{ background: step.color }}
              />

              {/* Top glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none z-0"
                style={{ background: `radial-gradient(circle at 50% 0%, ${step.color}20, transparent 70%)` }}
              />

              {/* Icon + number row */}
              <div className="flex items-center justify-between relative z-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-white/20"
                  style={{ background: `${step.color}20`, border: `1.5px solid ${step.color}50` }}
                >
                  <step.Icon
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-125"
                    style={{ color: step.color }}
                  />
                </div>
                <span className="text-4xl font-black transition-colors duration-300 text-gray-100 dark:text-white/10 group-hover:text-white/20">
                  {step.num}
                </span>
              </div>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 group-hover:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300 group-hover:text-white/90">
                  {step.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="relative z-10 flex items-center gap-2">
                <div
                  className="h-px flex-1 transition-all duration-300 group-hover:bg-white/40"
                  style={{ background: `${step.color}40` }}
                />
                <ArrowRight
                  className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                  style={{ color: step.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
