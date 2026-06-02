"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Users, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CLIENT_BASE_URL as BASE_URL } from "@/lib/config";

export default function TourSearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [guests, setGuests] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`${BASE_URL}/tour/categories`);
      if (res?.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = () => {
    router.push(
      `/explore?search=${search}&category=${category}&guests=${guests}`,
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-8 md:mt-12 w-full px-4 sm:px-0 max-w-5xl"
    >
      {/* Modern compact search bar - responsive */}
      <div className="rounded-2xl md:rounded-full backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border border-white/30 dark:border-white/10 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-0 p-2 md:p-2">
          {/* Destination Input */}
          <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10">
            <MapPin className="w-4 h-4 md:w-4.5 md:h-4.5 text-red-500 shrink-0" />
            <input
              type="text"
              placeholder="Where?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-xs md:text-sm outline-none"
            />
          </div>

          {/* Category Select */}
          <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10">
            <div className="w-3 md:w-4 h-3 md:h-4 rounded-full bg-blue-500 shrink-0" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white text-xs md:text-sm h-auto p-0 focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guests Select */}
          <div className="flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-6 py-3 md:py-4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/10">
            <Users className="w-4 h-4 md:w-4.5 md:h-4.5 text-green-500 shrink-0" />
            <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
              <SelectTrigger className="flex-1 bg-transparent border-0 text-gray-900 dark:text-white text-xs md:text-sm h-auto p-0 focus:ring-0 focus:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10">
                {[1, 2, 3, 4, 5, 6].map((g) => (
                  <SelectItem key={g} value={g.toString()}>
                    {g} Guest{g > 1 ? "s" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <motion.button
            onClick={handleSearch}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative px-4 md:px-8 py-3 md:py-4 font-semibold rounded-xl md:rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center md:justify-start gap-1 md:gap-2 shrink-0 m-0 md:m-2 overflow-hidden w-full md:w-auto"
          >
            {/* Red background */}
            <div className="absolute inset-0 bg-red-500 rounded-xl md:rounded-full" />

            {/* White background shutter from right to left */}
            <motion.div
              animate={{ scaleX: isHovering ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 bg-white rounded-xl md:rounded-full origin-right"
            />

            {/* Content */}
            <motion.span
              animate={{ color: isHovering ? "#7c3aed" : "#ffffff" }}
              transition={{ duration: 0.4 }}
              className="relative text-xs md:text-sm font-semibold"
            >
              Search
            </motion.span>

            <motion.div
              animate={{ x: [0, 6, 0], color: isHovering ? "#7c3aed" : "#ffffff" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <ArrowRight className="w-3.5 h-3.5 md:w-4.5 md:h-4.5" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
