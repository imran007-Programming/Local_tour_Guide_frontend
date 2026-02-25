"use client";

import { useEffect, useState } from "react";
import { BASE_URL } from "@/lib/config";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";
import { MapPin, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import BreadcrumbBanner from "@/app/dashboard/components/BreadcrumbBanner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Guide {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  languages: string[];
  guide: {
    id: string;
    expertise: string[];
    dailyRate: number;
    _count: {
      bookings: number;
    };
    averageRating?: number;
    totalReviews?: number;
  };
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (expertiseFilter !== "all")
          params.append("expertise", expertiseFilter);
        if (ratingFilter !== "all")
          params.append("minRating", ratingFilter);
        
        if (priceFilter === "high-to-low") {
          params.append("sortBy", "dailyRate");
          params.append("sortOrder", "desc");
        } else if (priceFilter === "low-to-high") {
          params.append("sortBy", "dailyRate");
          params.append("sortOrder", "asc");
        }

        const res = await fetch(`${BASE_URL}/guides?${params}`);
        if (res?.ok) {
          const result = await res.json();

          setGuides(result.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch guides:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchGuides, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, expertiseFilter, priceFilter, ratingFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  return (
    <>
      <BreadcrumbBanner />
      <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-4">
        All <span className="text-red-500">Expert</span> Guides
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
        Browse through our collection of professional tour guides ready to make
        your journey unforgettable.
      </p>

      <div className="flex gap-8">
        {/* Left Sidebar - Filters */}
        <div className="w-80 flex-shrink-0">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-6">Filters</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Expertise</label>
              <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Adventure">Adventure</SelectItem>
                  <SelectItem value="Culture">Culture</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Wildlife">Wildlife</SelectItem>
                  <SelectItem value="Gastronomy">Gastronomy</SelectItem>
                  <SelectItem value="Heritage">Heritage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Price</label>
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                  <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Minimum Rating</label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      4+ Stars
                    </div>
                  </SelectItem>
                  <SelectItem value="3">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      3+ Stars
                    </div>
                  </SelectItem>
                  <SelectItem value="2">
                    <div className="flex items-center gap-2">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      2+ Stars
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Right Side - Guides */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <div className="relative h-64">
              <Image
                src={guide.profilePic || "/avatar.png"}
                alt={guide.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h3 className="text-xl font-semibold">{guide.name}</h3>

              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mt-1">
                <MapPin size={14} />
                {guide.languages.slice(0, 2).join(", ")}
              </div>

              {guide.guide.averageRating && guide.guide.totalReviews ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= Math.round(guide.guide.averageRating!)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {guide.guide.averageRating.toFixed(1)} ({guide.guide.totalReviews})
                  </span>
                </div>
              ) : null}

              {guide.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {guide.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {guide.guide.expertise.slice(0, 3).map((exp, idx) => (
                  <span
                    key={idx}
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      idx === 0
                        ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                        : idx === 1
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                          : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {exp}
                  </span>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-zinc-800 my-4"></div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Total Bookings
                  </p>
                  <p className="font-semibold">{guide.guide._count.bookings}</p>
                </div>

                <div>
                  <p className="text-gray-500 dark:text-gray-400">Daily Rate</p>
                  <p className="font-semibold">${guide.guide.dailyRate}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
          </div>

          {guides.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No guides available
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
