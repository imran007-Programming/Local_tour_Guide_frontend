"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TourSearchBar() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    router.push(
      `/explore?search=${search}&category=${category}&guests=${guests}`,
    );
  };

  return (
    <div
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-lg border
          border-gray-300 dark:border-zinc-700
          bg-white dark:bg-zinc-800
          text-black dark:text-white
          px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-red-500
          transition"
          >
            <option value="">All Categories</option>
            <option value="NATURE">Nature</option>
            <option value="ADVENTURE">Adventure</option>
            <option value="CULTURE">Culture</option>
            <option value="FOOD">Food</option>
            <option value="HISTORICAL">Historical</option>
          </select>
        </div>

        {/* Guests */}
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border
          border-gray-300 dark:border-zinc-700
          bg-white dark:bg-zinc-800
          text-black dark:text-white
          px-3 py-2 text-sm outline-none
          focus:ring-2 focus:ring-red-500
          transition"
          >
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g} Guest{g > 1 ? "s" : ""}
              </option>
            ))}
          </select>
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
    </div>
  );
}
