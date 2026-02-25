"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/config";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Search } from "lucide-react";
import BookingPagination from "@/app/dashboard/bookings/BookingPagination";
import TourCard from "./TourCard";
import BreadcrumbBanner from "@/app/dashboard/components/BreadcrumbBanner";
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

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [city, setCity] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
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

  useEffect(() => {
    const fetchTours = async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
        sortOrder,
      });
      if (searchTerm) params.append("searchTerm", searchTerm);
      if (category && category !== "all") params.append("category", category);
      if (city) params.append("city", city);
      if (priceRange[0] > 0) params.append("minPrice", priceRange[0].toString());
      if (priceRange[1] < 1000) params.append("maxPrice", priceRange[1].toString());
      if (guest) params.append("guest", guest);

      const res = await fetch(`${BASE_URL}/tour?${params}`);
      if (res?.ok) {
        const result = await res.json();
        setTours(result.data || []);
        const meta = result.meta;
        setTotalPages(Math.ceil(meta.total / meta.limit));
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchTours, 300);
    return () => clearTimeout(debounce);
  }, [currentPage, searchTerm, category, city, priceRange, guest, sortBy, sortOrder]);

  return (
    <>
      <BreadcrumbBanner />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Explore Tours</h1>

        <div className="flex gap-8 px-4">
        {/* Left Sidebar - Filters */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
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

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">City</label>
              <Input
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={1000}
                step={10}
                className="mt-2"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Guests</label>
              <Input
                placeholder="Number of guests"
                type="number"
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="createdAt">Newest</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Order</label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearchTerm("");
                setCategory("all");
                setCity("");
                setPriceRange([0, 1000]);
                setGuest("");
                setSortBy("createdAt");
                setSortOrder("desc");
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Right Side - Tours */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spinner size="lg" className="border-red-500" />
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No tours found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
    </>
  );
}

export default function ToursExplore() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" className="border-red-500" />
      </div>
    }>
      <ToursExploreContent />
    </Suspense>
  );
}
