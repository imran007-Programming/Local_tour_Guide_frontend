"use client";

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300">
      {/* ===== Top Feature Bar ===== */}

      <div className="bg-red-600 text-white py-3 overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {[
            "Comprehensive Planning",
            "Expert Guidance",
            "Local Experience",
            "Customer Support",
            "Sustainability Efforts",
            "Multiple Destinations",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mx-8 text-sm font-semibold whitespace-nowrap"
            >
              <span>✴</span>
              <span className="text-xl">{item}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* ===== Main Links Section ===== */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
        {/* Column Template */}
        {[
          {
            title: "Pages",
            items: [
              "Our Team",
              "Pricing Plans",
              "Gallery",
              "Settings",
              "Profile",
              "Listings",
            ],
          },
          {
            title: "Company",
            items: [
              "About Us",
              "Careers",
              "Blog",
              "Affiliate Program",
              "Add Your Listing",
              "Our Partners",
            ],
          },
          {
            title: "Destinations",
            items: [
              "Hawaii",
              "Istanbul",
              "San Diego",
              "Belgium",
              "Los Angeles",
              "New York",
            ],
          },
          {
            title: "Support",
            items: [
              "Contact Us",
              "Legal Notice",
              "Privacy Policy",
              "Terms & Conditions",
              "Chat Support",
              "Refund Policy",
            ],
          },
          {
            title: "Services",
            items: [
              "Hotel",
              "Activity Finder",
              "Flight Finder",
              "Holiday Rental",
              "Car Rental",
            ],
          },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold mb-4 border-b border-red-500 inline-block pb-1 text-zinc-900 dark:text-white">
              {section.title}
            </h4>
            <ul className="space-y-3 text-zinc-600 dark:text-zinc-400">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="hover:text-red-500 cursor-pointer transition"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ===== App + Support Section ===== */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="bg-white dark:bg-zinc-900 rounded-xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md dark:shadow-none transition">
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            🌍 DreamsTour
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-600 dark:text-zinc-400">
              Available on :
            </span>
            <button className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-md text-sm transition">
              Google Play
            </button>
            <button className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white px-4 py-2 rounded-md text-sm transition">
              App Store
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-red-600 text-white p-3 rounded-full">🎧</div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Customer Support
              </p>
              <p className="font-semibold text-zinc-900 dark:text-white">
                +1 56589 54598
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Copyright ===== */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Copyright © 2025. All Rights Reserved,{" "}
            <span className="text-red-500">DreamsTour</span>
          </p>

          <div className="flex gap-6 text-zinc-600 dark:text-zinc-400">
            <Facebook size={18} className="hover:text-red-500 transition" />
            <Twitter size={18} className="hover:text-red-500 transition" />
            <Instagram size={18} className="hover:text-red-500 transition" />
            <Linkedin size={18} className="hover:text-red-500 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
}
