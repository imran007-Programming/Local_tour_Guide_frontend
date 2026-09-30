"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldLabel = "block text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400";
const triggerClass =
  "mt-0.5 w-full border-0 bg-transparent p-0 text-sm text-zinc-900 shadow-none focus:ring-0 focus-visible:ring-0 data-[size=default]:h-5 dark:bg-transparent dark:text-white dark:hover:bg-transparent";

export default function TourSearchBar({ categories }: { categories: string[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    router.push(`/explore?search=${search}&category=${category}&guests=${guests}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="mt-8 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex flex-col sm:flex-row sm:items-center">
        <label className="flex-1 px-4 py-2.5">
          <span className={fieldLabel}>Where</span>
          <input
            type="text"
            placeholder="City or tour"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-0.5 h-5 w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
          />
        </label>

        <div className="mx-4 h-px bg-zinc-200 sm:mx-0 sm:h-8 sm:w-px dark:bg-zinc-800" />

        <div className="flex-1 px-4 py-2.5">
          <span className={fieldLabel}>Category</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={triggerClass}>
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mx-4 h-px bg-zinc-200 sm:mx-0 sm:h-8 sm:w-px dark:bg-zinc-800" />

        <div className="px-4 py-2.5 sm:w-32">
          <span className={fieldLabel}>Guests</span>
          <Select value={guests.toString()} onValueChange={(v) => setGuests(Number(v))}>
            <SelectTrigger className={triggerClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <SelectItem key={g} value={g.toString()}>
                  {g} guest{g > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 sm:mt-0 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Search size={16} />
          <span className="sm:hidden lg:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
