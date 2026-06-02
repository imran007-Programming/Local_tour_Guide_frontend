"use client";

import { motion } from "framer-motion";
import { MapPin, Users, Star, Globe, ShieldCheck, Headphones, ArrowRight } from "lucide-react";
import { NumberTicker } from "../ui/number-ticker";

const stats = [
  { icon: Globe,  label: "Destinations",    value: 50,   color: "#14b8a6" },
  { icon: MapPin, label: "Tours Completed",  value: 7000, color: "#f43f5e" },
  { icon: Users,  label: "Happy Clients",    value: 100,  color: "#f59e0b" },
  { icon: Star,   label: "Verified Guides",  value: 89,   color: "#6366f1" },
];

const features = [
  {
    icon: ShieldCheck,
    title: "100% Verified Guides",
    desc: "Every guide is background-checked, trained, and rated by real travellers.",
    color: "#14b8a6",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Our team is always available to help you before, during, and after your trip.",
    color: "#f43f5e",
  },
  {
    icon: MapPin,
    title: "Local Expertise",
    desc: "Authentic experiences crafted by people who truly know their destination.",
    color: "#6366f1",
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-zinc-950 dark:bg-zinc-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">

        {/* Top: image + content */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-10">

          {/* Left — image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-96 lg:h-125"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/chris-karidis-nnzkZNYWHaU-unsplash.jpg"
              alt="Travellers exploring"
              className="w-full h-full object-cover rounded-3xl"
            />
            <div className="absolute inset-0 rounded-3xl bg-linear-to-t from-black/50 via-transparent to-transparent" />

            {/* Floating badge — top right */}
            <div className="absolute top-6 right-6 bg-white dark:bg-zinc-800 rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Avg Rating</p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">5.0</span>
              </div>
            </div>

            {/* Floating badge — bottom left */}
            <div className="absolute bottom-6 left-6 bg-white dark:bg-zinc-800 rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse block" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold">Active Bookings</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">2,500+</p>
              </div>
            </div>
          </motion.div>

          {/* Right — content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase">— About Us</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Explore Beyond <br />
              <span className="text-red-500">the Horizon</span>
            </h2>
            <p className="mt-5 text-gray-500 dark:text-gray-400 leading-relaxed">
              We pride ourselves on offering personalized services for travellers worldwide,
              crafting unique and unforgettable experiences led by passionate local experts.
            </p>

            {/* Feature list */}
            <div className="mt-8 flex flex-col gap-5">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${f.color}18` }}
                  >
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{f.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-8 flex items-center gap-4"
            >
              <a
                href="/explore"
                className="group inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-red-200 dark:hover:shadow-red-900 hover:shadow-lg text-sm"
              >
                Explore Tours
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              <a
                href="/guides"
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
              >
                Meet our Guides
                <ArrowRight size={14} />
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center gap-4"
            >
              {/* Icon */}
              <div
                className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `${s.color}15` }}
              >
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>

              {/* Text */}
              <div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
                  <NumberTicker value={s.value} />+
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-medium leading-snug">
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
