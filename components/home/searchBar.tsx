"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BASE_URL } from "@/lib/config";

export default function TourSearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [guests, setGuests] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

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

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-10 w-full max-w-5xl rounded-2xl
  bg-white dark:bg-zinc-900
  shadow-xl dark:shadow-lg
  border border-transparent dark:border-zinc-800
"
    >
      {/* Top tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-zinc-800 p-4">
        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white">
          Tours
        </span>
      </div>

      {/* Search fields */}
      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-4">
        {/* Destination */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Destination / Tour
          </label>
          <input
            type="text"
            placeholder="Where are you going?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-1 w-full rounded-lg border
          border-gray-300 dark:border-zinc-700
          bg-white dark:bg-zinc-800
          text-black dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-red-500
          transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Category
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Guests */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Guests
          </label>
          <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="w-full">
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <SelectItem key={g} value={g.toString()}>
                  {g} Guest{g > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search button */}
        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full rounded-xl bg-red-500 px-6 py-3
          text-sm font-semibold text-white
          hover:bg-red-600 transition"
          >
            Search Tours
          </button>
        </div>
      </div>
    </motion.div>
  );
}
