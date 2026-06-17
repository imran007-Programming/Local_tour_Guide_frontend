"use client";

import Image from "next/image";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Share,
  Globe,
  Navigation,
  Grid3X3,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { BASE_URL } from "@/lib/config";
import BookingButton from "./BookingButton";
import TourReviews from "./TourReviews";
import WishlistButton from "./WishlistButton";
import ContactGuideButton from "./ContactGuideButton";
import { motion } from "framer-motion";

export default function TourPageContent({ tour, guideRating }: any) {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    clientAuthFetch(`${BASE_URL}/auth/me`)
      .then((res) => (res?.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.role) setUserRole(data.data.role);
      })
      .catch(() => {});
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: tour.title,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const avgRating = guideRating?.averageRating || 0;
  const totalReviews = guideRating?.totalReviews || 0;

  return (
    <>
      <div className="max-w-[1120px] mx-auto px-6 pt-24 pb-12">
        {/* ===== TITLE SECTION ===== */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[32px] font-semibold text-zinc-900 dark:text-white leading-tight">
            {tour.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between mt-2 gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {avgRating > 0 && (
                <span className="flex items-center gap-1 font-medium">
                  <Star size={14} className="fill-black dark:fill-white" />
                  {avgRating.toFixed(1)}
                </span>
              )}
              {totalReviews > 0 && (
                <>
                  <span className="text-zinc-400">·</span>
                  <span className="underline font-medium">
                    {totalReviews} review{totalReviews > 1 ? "s" : ""}
                  </span>
                </>
              )}
              <span className="text-zinc-400">·</span>
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {tour.city}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm font-medium underline hover:opacity-70 transition"
              >
                <Share size={15} />
                Share
              </button>
              <WishlistButton tourId={tour.id} userRole={userRole} />
            </div>
          </div>
        </div>

        {/* ===== PHOTO GRID (Airbnb Style) ===== */}
        <div className="relative rounded-xl overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 h-[300px] md:h-[400px] lg:h-[460px]">
            {/* Large image */}
            <div
              className="relative md:col-span-2 md:row-span-2 cursor-pointer group"
              onClick={() => setShowAllPhotos(true)}
            >
              <Image
                src={tour.images[0] || "/placeholder.jpg"}
                alt={tour.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:brightness-90 transition duration-300"
                priority
              />
            </div>
            {/* Smaller images */}
            {tour.images.slice(1, 5).map((img: string, i: number) => (
              <div
                key={i}
                className="relative hidden md:block cursor-pointer group"
                onClick={() => setShowAllPhotos(true)}
              >
                <Image
                  src={img}
                  alt={`${tour.title} ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover group-hover:brightness-90 transition duration-300"
                />
              </div>
            ))}
          </div>
          {/* Show all photos button */}
          {tour.images.length > 5 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-zinc-600 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 hover:scale-105 transition shadow-md"
            >
              <Grid3X3 size={16} />
              Show all photos
            </button>
          )}
        </div>

        {/* ===== MAIN CONTENT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info Row */}
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-white">
                Tour hosted by {tour.guide.user.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                <span>{tour.duration} hours</span>
                <span>·</span>
                <span>Max {tour.maxGroupSize} guests</span>
                <span>·</span>
                <span>{tour.category}</span>
                <span>·</span>
                <span>{tour.languages.join(", ")}</span>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Highlights */}
            <div className="space-y-5">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Navigation size={24} className="text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Expert local guide</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tour.guide.user.name} has been guiding tours with expertise in{" "}
                    {tour.guide.expertise.slice(0, 2).join(" & ")}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <MapPin size={24} className="text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Great meeting point</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tour.meetingPoint}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <Globe size={24} className="text-zinc-700 dark:text-zinc-300" />
                </div>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">
                    Available in {tour.languages.length} language{tour.languages.length > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {tour.languages.join(", ")}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                About this tour
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {tour.description}
              </p>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Itinerary */}
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
                What you'll do
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {tour.itinerary}
              </p>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Meet your guide */}
            <div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-5">
                Meet your guide
              </h3>
              <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <div className="flex items-start gap-5">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-zinc-200 dark:ring-zinc-700">
                    <Image
                      src={tour.guide.user.profilePic || "/avatar.png"}
                      alt={tour.guide.user.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      {tour.guide.user.name}
                    </h4>
                    {avgRating > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <= Math.round(avgRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-zinc-300 dark:text-zinc-600"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-zinc-500">
                          {avgRating.toFixed(1)} ({totalReviews} reviews)
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      ${tour.guide.dailyRate}/day
                    </p>
                  </div>
                </div>

                {tour.guide.user.bio && (
                  <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {tour.guide.user.bio}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {tour.guide.expertise.map((exp: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    >
                      {exp}
                    </span>
                  ))}
                </div>

                {tour.guide.user.languages &&
                  Array.isArray(tour.guide.user.languages) &&
                  tour.guide.user.languages.length > 0 && (
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="font-medium">Languages:</span>{" "}
                      {tour.guide.user.languages.join(", ")}
                    </p>
                  )}
              </div>
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Reviews Section */}
            <TourReviews tourId={tour.id} userRole={userRole} />
          </div>

          {/* ===== RIGHT STICKY BOOKING CARD ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-[0_6px_16px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_16px_rgba(0,0,0,0.4)] space-y-5">
              {/* Price */}
              <div className="flex items-baseline gap-1">
                <span className="text-[22px] font-semibold text-zinc-900 dark:text-white">
                  ${tour.price}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                  / person
                </span>
              </div>

              {/* Rating summary */}
              {avgRating > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Star size={14} className="fill-black dark:fill-white" />
                  <span className="font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-zinc-400">·</span>
                  <span className="text-zinc-500 underline">
                    {totalReviews} review{totalReviews > 1 ? "s" : ""}
                  </span>
                </div>
              )}

              {/* Booking Actions */}
              {(!userRole || userRole === "TOURIST") && (
                <div className="space-y-3">
                  <BookingButton tourId={tour.id} userRole={userRole} />
                  <ContactGuideButton
                    guideId={tour.guide.user.id}
                    guideName={tour.guide.user.name}
                    guideProfilePic={tour.guide.user.profilePic}
                    userRole={userRole}
                  />
                </div>
              )}

              {/* Details */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Clock size={16} />
                    Duration
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {tour.duration} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Users size={16} />
                    Group size
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    Up to {tour.maxGroupSize}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Globe size={16} />
                    Languages
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    {tour.languages.length}
                  </span>
                </div>
              </div>

              {/* Report */}
              <p className="text-xs text-center text-zinc-400 pt-2 underline cursor-pointer hover:text-zinc-600 transition">
                Report this listing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MOBILE STICKY BOOKING BAR ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 p-4 lg:hidden z-50">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-semibold">${tour.price}</span>
              <span className="text-sm text-zinc-500">/ person</span>
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <Star size={12} className="fill-black dark:fill-white" />
                <span>{avgRating.toFixed(1)}</span>
                <span>· {totalReviews} reviews</span>
              </div>
            )}
          </div>
          <BookingButton tourId={tour.id} userRole={userRole} />
        </div>
      </div>

      {/* ===== FULL SCREEN PHOTO GALLERY MODAL ===== */}
      {showAllPhotos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white dark:bg-black z-[9999] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10 p-4 border-b border-zinc-200 dark:border-zinc-800">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition"
            >
              <ChevronRight size={16} className="rotate-180" />
              Back
            </button>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
            {tour.images.map((img: string, i: number) => (
              <div key={i} className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt={`${tour.title} photo ${i + 1}`}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
