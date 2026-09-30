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
import TourCard from "./TourCard";
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
  const [city, setCity] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 1000]);
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
  }, [currentPage, searchTerm, category, city, debouncedPriceRange, guest, sortBy, sortOrder]);

  const hasActiveFilters =
    searchTerm ||
    (category && category !== "all") ||
    city ||
    debouncedPriceRange[0] > 0 ||
    debouncedPriceRange[1] < 1000 ||
    guest;

  const resetFilters = () => {
    setSearchTerm("");
    setCategory("all");
    setCity("");
    setPriceRange([0, 1000]);
    setGuest("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // Plain JSX (not a nested component) so inputs keep focus between renders
  const filterPanel = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          Search
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            placeholder="Search tours..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          Category
        </label>
        <Select value={category} onValueChange={(v) => { setCategory(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10">
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
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          City
        </label>
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            placeholder="Any city"
            value={city}
            onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
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
        <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
          Guests
        </label>
        <input
          placeholder="Any size"
          type="number"
          min={1}
          value={guest}
          onChange={(e) => { setGuest(e.target.value); setCurrentPage(1); }}
          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 transition"
        />
      </div>

      {/* Sort */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Sort By
          </label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10 text-xs">
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
          <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Order
          </label>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full rounded-xl bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 h-10 text-xs">
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
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 rounded-xl transition"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#070A13] pt-10 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
            Explore Tours
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {totalCount > 0
              ? `${totalCount} tour${totalCount > 1 ? "s" : ""} available`
              : "Find your perfect tour experience"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={16} />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-red-500" />
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
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-3xl overflow-y-auto p-6">
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
                  className="w-full mt-6 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition"
                >
                  Show Results
                </button>
              </div>
            </div>
          )}

          {/* Tours Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden"
                  >
                    <div className="h-44 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full animate-pulse" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tours.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                  <MapPin size={28} className="text-zinc-400" />
                </div>
                <h3 className="text-base font-medium text-zinc-900 dark:text-white">
                  No tours found
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Try adjusting your filters
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 px-5 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
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
