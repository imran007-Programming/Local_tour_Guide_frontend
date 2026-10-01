"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/config";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  ChevronDown,
} from "lucide-react";
import BookingPagination from "@/app/dashboard/bookings/BookingsPagination";
import { TourCard } from "@/components/home/FeaturedTours";
import SectionHeading from "@/components/home/SectionHeading";
import Spinner from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: number;
  city: string;
  category: string;
  images: string[];
  maxGroupSize: number;
}

function ToursExploreContent() {
  const searchParams = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [duration, setDuration] = useState(searchParams.get("duration") || "any");
  // The home page search can pre-set a budget via ?minPrice=/?maxPrice=
  const initialMinPrice = Math.min(Math.max(Number(searchParams.get("minPrice")) || 0, 0), 1000);
  const initialMaxPrice = Math.min(Number(searchParams.get("maxPrice")) || 1000, 1000);
  const [priceRange, setPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([initialMinPrice, initialMaxPrice]);
  const [guest, setGuest] = useState(searchParams.get("guests") || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
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

  // Debounce price range so slider is smooth
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 400);
    return () => clearTimeout(timer);
  }, [priceRange]);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (category && category !== "all") params.append("category", category);
      if (city) params.append("city", city);
      if (debouncedPriceRange[0] > 0)
        params.append("minPrice", debouncedPriceRange[0].toString());
      if (debouncedPriceRange[1] < 1000)
        params.append("maxPrice", debouncedPriceRange[1].toString());
      if (guest) params.append("guest", guest);
      if (duration && duration !== "any") params.append("duration", duration);

      const res = await fetch(`${BASE_URL}/tour?${params}`);
      if (res?.ok) {
        const result = await res.json();
        setTours(result.data || []);
        const meta = result.meta;
        setTotalCount(meta?.total || 0);
        setTotalPages(Math.ceil((meta?.total || 0) / (meta?.limit || 12)));
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchTours, 300);
    return () => clearTimeout(debounce);
  }, [currentPage, searchTerm, category, city, debouncedPriceRange, guest, duration, sortBy, sortOrder]);

  const hasActiveFilters =
    searchTerm ||
    (category && category !== "all") ||
    city ||
    debouncedPriceRange[0] > 0 ||
    debouncedPriceRange[1] < 1000 ||
    guest ||
    (duration && duration !== "any");

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setCity("");
    setPriceRange([0, 1000]);
    setGuest("");
    setDuration("any");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Plain JSX (not a nested component) so inputs keep focus between renders
  const filterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          Search
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="field-soft pl-10"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          Category
        </label>
        <Select value={category} onValueChange={(v) => { setCategory(v); setCurrentPage(1); }}>
          <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-slate-100 shadow-none dark:bg-zinc-800/70">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          City
        </label>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Any city"
            value={city}
            onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}
            className="field-soft pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          Price Range
        </label>
        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-medium">
            ${priceRange[0]}
          </span>
          <span className="text-xs text-zinc-400">—</span>
          <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-md text-xs font-medium">
            ${priceRange[1]}
          </span>
        </div>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={1000}
          step={10}
        />
      </div>

      {/* Guests */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          Guests
        </label>
        <input
          placeholder="Any size"
          type="number"
          min={1}
          value={guest}
          onChange={(e) => { setGuest(e.target.value); setCurrentPage(1); }}
          className="field-soft"
        />
      </div>

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
          Duration
        </label>
        <Select value={duration} onValueChange={(v) => { setDuration(v); setCurrentPage(1); }}>
          <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-slate-100 shadow-none dark:bg-zinc-800/70">
            <SelectValue placeholder="Any length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any length</SelectItem>
            <SelectItem value="2">Short trip (2+ hrs)</SelectItem>
            <SelectItem value="4">Half day (4+ hrs)</SelectItem>
            <SelectItem value="8">Full day (8+ hrs)</SelectItem>
            <SelectItem value="24">Multi-day (24+ hrs)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-slate-100 text-xs shadow-none dark:bg-zinc-800/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-950 dark:text-white">
            Order
          </label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-12 w-full rounded-xl border-0 bg-slate-100 text-xs shadow-none dark:bg-zinc-800/70">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">High → Low</SelectItem>
              <SelectItem value="asc">Low → High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-blue-500/15 dark:hover:text-blue-400"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-20 pt-6 md:pb-28 dark:bg-zinc-950">
      <div className="container-page max-w-7xl">
        {/* Page Header */}
        <div className="mb-10">
          <SectionHeading
            watermark="Explore"
            title="Explore Tours"
            subtitle={
              totalCount > 0
                ? `${totalCount} tour${totalCount > 1 ? "s" : ""} from local guides — small groups, local insight and fair prices.`
                : "Find your perfect tour experience with a local guide."
            }
          />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Desktop Sidebar */}
          <aside className="hidden w-72.5 shrink-0 lg:block">
            <div className="sticky top-24 rounded-3xl border border-slate-200/80 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                    <SlidersHorizontal size={15} />
                  </span>
                  Filters
                </h2>
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="btn-dark gap-2"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </button>
          </div>

          {/* Mobile Filter Drawer */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6 dark:bg-zinc-900">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                    Filters
                  </h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                  >
                    <X size={20} />
                  </button>
                </div>
                {filterPanel}
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="btn-pill mt-6 w-full justify-center py-3 pl-5 pr-5"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          {/* Tours Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-slate-200/80 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="aspect-4/3 animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-800" />
                    <div className="space-y-3 px-2 pb-2 pt-4">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                      <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                      <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-zinc-800" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/15">
                  <MapPin size={28} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                  No tours found
                </h3>
                <p className="mt-1 text-[15px] text-slate-600 dark:text-zinc-400">
                  Try adjusting your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="btn-dark mt-5"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {tours.map((tour, i) => (
                    <TourCard key={tour.id} tour={tour} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <BookingPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ToursExplore() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" className="text-red-500" />
        </div>
      }
    >
      <ToursExploreContent />
    </Suspense>
  );
}
