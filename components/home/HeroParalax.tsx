"use client";

import { Play } from "lucide-react";
import { motion } from "framer-motion";
import ClientsMarquee from "./HeroMarquee";

export default function ParallaxHero() {
  return (
    <>
      <section
        className="relative flex items-center justify-center"
        style={{
          height: "70vh",
          backgroundImage: "url('/hero/priscilla-du-preez-KoF1cXdF9Ws-unsplash.jpg')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Play button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Play video"
        >
          <span className="absolute inset-0 rounded-full bg-white/40 animate-ping" />
          <Play className="w-8 h-8 text-black ml-1" aria-hidden="true" />
        </motion.button>
      </section>

      {/* Marquee */}
      <section className="relative dark:bg-black bg-white py-2">
        <ClientsMarquee />
      </section>
    </>
  );
}
