"use client";

import { Briefcase, Ticket, Plane, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const benefits = [
    {
      icon: <Briefcase className="w-6 h-6 text-white" />,
      title: "VIP Packages",
      description:
        "Include premium seating, meet-and-greet experiences, backstage tours.",
      bg: "bg-lime-500",
    },
    {
      icon: <Ticket className="w-6 h-6 text-white" />,
      title: "Concert Tickets",
      description:
        "A centralized place to buy tickets for various dates of the tour",
      bg: "bg-orange-500",
    },
    {
      icon: <Plane className="w-6 h-6 text-white" />,
      title: "Travel Packages",
      description: "Bundles that include concert tickets, accommodations",
      bg: "bg-purple-600",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Best Price Guarantee",
      description: "Such as private rehearsals, soundcheck access,",
      bg: "bg-emerald-600",
    },
  ];

  return (
    <section className="relative bg-gray-100 dark:bg-black py-24">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 text-center"
      >
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="text-4xl font-bold text-gray-900 dark:text-white"
        >
          Our{" "}
          <span className="text-red-500 underline underline-offset-4">
            Benefits
          </span>{" "}
          & Key Advantages
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: false }}
          className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
        >
          DreamsTour, a tour operator specializing in dream destinations, offers
          a variety of benefits for travelers.
        </motion.p>

        {/* Cards */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
              }}
              viewport={{ once: false, amount: 0.2 }}
              className="group relative rounded-2xl bg-white dark:bg-zinc-900
              p-8 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Large Hover Icon */}
              <div
                className="absolute top-6 right-6
                opacity-0 translate-x-4 -translate-y-4
                group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0
                transition-all duration-500"
              >
                {index === 0 && (
                  <Briefcase className="w-16 h-16 text-lime-500 opacity-80" />
                )}
                {index === 1 && (
                  <Ticket className="w-16 h-16 text-orange-500 opacity-80" />
                )}
                {index === 2 && (
                  <Plane className="w-16 h-16 text-purple-600 opacity-80" />
                )}
                {index === 3 && (
                  <ShieldCheck className="w-16 h-16 text-emerald-600 opacity-80" />
                )}
              </div>

              {/* Small Icon */}
              <div
                className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
