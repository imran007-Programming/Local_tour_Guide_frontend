"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white dark:bg-zinc-950"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        {/* Pin with expanding ripples */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          {[0, 1].map((i) => (
            <motion.span
              key={i}
              className="absolute h-full w-full rounded-full bg-blue-500/25"
              initial={{ scale: 0.4, opacity: 0.7 }}
              animate={{ scale: 1.4, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.9, ease: "easeOut" }}
            />
          ))}
          <motion.span
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <MapPin size={26} strokeWidth={2.25} />
          </motion.span>
        </div>

        <p className="mt-6 font-display text-xl uppercase tracking-wide text-slate-950 dark:text-white">
          TourGuide
        </p>

        {/* Sliding progress bar */}
        <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800">
          <motion.div
            className="h-full w-1/3 rounded-full bg-blue-500"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </div>
  );
}
