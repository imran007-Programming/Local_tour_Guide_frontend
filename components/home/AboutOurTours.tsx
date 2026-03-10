"use client";

import Image from "next/image";
import { MapPin, Users, Star, Globe } from "lucide-react";
import aboutImg from "../../public/about-bg-01.svg";
import { NumberTicker } from "../ui/number-ticker";
export default function AboutSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* ================= LEFT SIDE ================= */}
        <div className="relative">
          {/* Main Image Container */}
          <div className="relative rounded-3xl bg-lime-500 dark:bg-lime-600 p-6 transition-colors duration-500">
            <Image
              src="/hero/Hero1.jpg"
              alt="Travelers"
              width={500}
              height={600}
              className="rounded-2xl object-cover"
            />
          </div>

          {/* Floating Card - All Listings */}
          <div className="absolute -top-10 right-10 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl">
            <p className="text-sm">All Listings</p>
          </div>

          {/* Floating Earnings Card */}
          <div className="absolute bottom-6 right-0 bg-white dark:bg-zinc-900 border border-red-500 px-6 py-4 rounded-xl shadow-lg transition-colors duration-500">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Today’s Earnings
            </p>
            <p className="text-lg font-bold">$2500</p>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div>
          <p className="text-red-500 font-semibold mb-4">About DreamsTour</p>

          <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
            Explore Beyond the Horizon:
            <br />
            Discover the World’s Wonders
          </h2>

          <p className="mt-6 text-gray-600 dark:text-gray-400 transition-colors duration-500">
            We pride ourselves on offering personalized services for high-end
            clientele, with a commitment to crafting unique and unforgettable
            travel experiences.
          </p>

          {/* Feature Points */}
          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-red-600 p-3 rounded-full text-white">
                <MapPin size={20} />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Clients navigate their journeys whether for travel or education.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-lime-600 p-3 rounded-full text-white">
                <Users size={20} />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Provides a range of services from immigration advice to vacation
                planning.
              </p>
            </div>
          </div>

          {/* CTA + Rating */}
          <div className="mt-10 flex items-center gap-8 flex-wrap">
            <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full font-medium hover:opacity-80 transition">
              Learn More
            </button>

            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                5.0 • 2K+ Reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-20 mx-auto max-w-6xl rounded-2xl overflow-hidden">
        {/* Full background image */}
        <div className="absolute inset-0">
          <Image
            src={aboutImg}
            alt="Background pattern"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Overlay layer for light & dark mode */}
        <div
          className="
        relative p-10
        grid grid-cols-2 md:grid-cols-4 gap-10 text-center

        bg-white/95
        dark:bg-black/40

        dark:backdrop-blur-2xl
        dark:border dark:border-white/10
        dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]

        transition-all duration-500
      "
        >
          <StatItem
            icon={<Globe />}
            label="Destinations Worldwide"
            value={50}
          />
          <StatItem icon={<MapPin />} label="Booking Completed" value={7000} />
          <StatItem icon={<Users />} label="Client Globally" value={100} />
          <StatItem icon={<Star />} label="Providers Registered" value={89} />
        </div>
      </div>
    </section>
  );
}

/* ================= STAT ITEM ================= */
function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  const getLabelColor = () => {
    switch (label) {
      case "Destinations Worldwide":
        return "text-[#187970]";
      case "Booking Completed":
        return "text-[#6B46C1]";
      case "Client Globally":
        return "text-[#DB2777]";
      case "Providers Registered":
        return "text-[#2563EB]";
      default:
        return "text-gray-600 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex  gap-x-5 justify-center text-cyan-600 dark:text-cyan-400 mb-2 transition-colors duration-500">
        {icon}
        <p
          className={`text-sm transition-colors duration-500 ${getLabelColor()}`}
        >
          {label}
        </p>
      </div>

      <p className="text-3xl font-bold mt-2">
        <NumberTicker value={value} />+
      </p>
    </div>
  );
}
