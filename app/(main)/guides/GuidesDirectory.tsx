"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GuideCard from "@/components/guides/GuideCard";
import type { GuideSummary } from "@/lib/publicApi";

const DEFAULT_EXPERTISE = ["History", "Adventure", "Culture", "Photography", "Wildlife", "Gastronomy", "Heritage"];

const triggerClass =
  "h-11 w-full rounded-lg border-zinc-200 bg-white text-sm data-[size=default]:h-11 dark:border-zinc-800 dark:bg-zinc-900 sm:w-44";

// The full guide list is small and already rendered by the server, so filtering
// happens in memory: instant results and no request per keystroke.
function applyFilters(
  guides: GuideSummary[],
  { searchTerm, expertise, rating, sort }: { searchTerm: string; expertise: string; rating: string; sort: string },
) {
  const q = searchTerm.trim().toLowerCase();
  const minRating = rating === "all" ? 0 : Number(rating);

  const result = guides.filter((g) => {
    if (q && !`${g.name} ${g.bio ?? ""}`.toLowerCase().includes(q)) return false;
    if (expertise !== "all" && !g.guide.expertise.includes(expertise)) return false;
    if (minRating && (g.guide.averageRating ?? 0) < minRating) return false;
    return true;
  });

  if (sort !== "all") {
    const dir = sort === "low-to-high" ? 1 : -1;
    result.sort((a, b) => ((a.guide.dailyRate ?? 0) - (b.guide.dailyRate ?? 0)) * dir);
  }
  return result;
}

export default function GuidesDirectory({ initialGuides }: { initialGuides: GuideSummary[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expertise, setExpertise] = useState("all");
  const [sort, setSort] = useState("all");
  const [rating, setRating] = useState("all");

  const hasFilters = searchTerm !== "" || expertise !== "all" || sort !== "all" || rating !== "all";
  const guides = useMemo(
    () => applyFilters(initialGuides, { searchTerm, expertise, rating, sort }),
    [initialGuides, searchTerm, expertise, rating, sort],
  );

  const expertiseOptions = useMemo(() => {
    const fromData = initialGuides.flatMap((g) => g.guide.expertise.filter(Boolean));
    return Array.from(new Set([...DEFAULT_EXPERTISE, ...fromData])).sort();
  }, [initialGuides]);

  const resetFilters = () => {
    setSearchTerm("");
    setExpertise("all");
    setSort("all");
    setRating("all");
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col gap-3 border-y border-zinc-200 py-4 lg:flex-row lg:items-center dark:border-zinc-800">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guides by name"
            aria-label="Search guides"
            className="h-11 w-full rounded-lg border border-zinc-200 bg-white pl-10 pr-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-zinc-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap sm:items-center">
          <Select value={expertise} onValueChange={setExpertise}>
            <SelectTrigger className={triggerClass} aria-label="Expertise">
              <SelectValue placeholder="Expertise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any expertise</SelectItem>
              {expertiseOptions.map((e) => (
                <SelectItem key={e} value={e}>
                  {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={rating} onValueChange={setRating}>
            <SelectTrigger className={triggerClass} aria-label="Minimum rating">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any rating</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="2">2+ stars</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className={triggerClass} aria-label="Sort by price">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Recommended</SelectItem>
              <SelectItem value="low-to-high">Price: low to high</SelectItem>
              <SelectItem value="high-to-low">Price: high to low</SelectItem>
            </SelectContent>
          </Select>

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              <X size={15} />
              Clear
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
        {guides.length} guide{guides.length === 1 ? "" : "s"}
      </p>

      {/* Results */}
      {guides.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
          <p className="font-medium text-zinc-900 dark:text-white">
            {hasFilters ? "No guides match your filters" : "No guides yet"}
          </p>
          {hasFilters && (
            <>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Try a different search or clear the filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
              >
                Clear filters
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
