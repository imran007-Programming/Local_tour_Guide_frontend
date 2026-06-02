"use client";

import Image from "next/image";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { BASE_URL } from "@/lib/config";
import BookingButton from "./BookingButton";
import TourReviews from "./TourReviews";
import WishlistButton from "./WishlistButton";
import ContactGuideButton from "./ContactGuideButton";
import ImageGallery from "./ImageGallery";

export default function TourPageContent({ tour, guideRating }: any) {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    clientAuthFetch(`${BASE_URL}/auth/me`)
      .then((res) => (res?.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.role) setUserRole(data.data.role);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8 mt-20">
        {/* Hero Image */}
        <div className="relative h-[60vh] rounded-2xl overflow-hidden">
          <Image
            src={tour.images[0] || "/placeholder.jpg"}
            alt={tour.title}
            fill
            sizes="(max-width: 1536px) 100vw, 1536px"
            className="object-cover"
            priority
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <h1 className="text-4xl font-bold">{tour.title}</h1>
              <WishlistButton
                tourId={tour.id}
                userRole={userRole}
              />
            </div>

            <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {tour.city}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {tour.duration} hours
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Max {tour.maxGroupSize} people
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Description</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tour.description}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Itinerary</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                {tour.itinerary}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Meeting Point</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tour.meetingPoint}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3">Languages</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {tour.languages.join(", ")}
              </p>
            </div>

            {/* Tour Guide */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Accociated Guide</h2>
              <div className="p-6 bg-gray-50 dark:bg-zinc-800 rounded-lg space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={tour.guide.user.profilePic || "/avatar.png"}
                      alt={tour.guide.user.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {tour.guide.user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tour.guide.user.email}
                    </p>
                    {guideRating?.averageRating && guideRating?.totalReviews ? (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <=
                                Math.round(guideRating.averageRating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {guideRating.averageRating.toFixed(1)} (
                          {guideRating.totalReviews})
                        </span>
                      </div>
                    ) : null}
                    <p className="text-sm font-medium text-red-600 mt-1">
                      ${tour.guide.dailyRate}/day
                    </p>
                  </div>
                </div>

                {tour.guide.user.bio && (
                  <div>
                    <h4 className="font-semibold mb-1">Bio</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {tour.guide.user.bio}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {tour.guide.expertise.map((exp: string, idx: number) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                </div>

                {tour.guide.user.languages &&
                  Array.isArray(tour.guide.user.languages) &&
                  tour.guide.user.languages.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-1">Languages</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {tour.guide.user.languages.join(", ")}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* Image Gallery */}
            {tour.images.length > 1 && (
              <ImageGallery images={tour.images.slice(1)} />
            )}
            {/* Reviews Section */}
            <TourReviews tourId={tour.id} userRole={userRole} />
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
              <div className="text-3xl font-bold text-red-600">
                ${tour.price}
              </div>
              <p className="text-gray-600 dark:text-gray-400">per person</p>

              {!userRole || userRole === "TOURIST" ? (
                <>
                  <BookingButton tourId={tour.id} userRole={userRole} />
                  <ContactGuideButton
                    guideId={tour.guide.user.id}
                    guideName={tour.guide.user.name}
                    guideProfilePic={tour.guide.user.profilePic}
                    userRole={userRole}
                  />
                </>
              ) : null}

              <div className="pt-4 border-t space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Category
                  </span>
                  <span className="font-medium">{tour.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="font-medium">{tour.duration} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Group Size
                  </span>
                  <span className="font-medium">Max {tour.maxGroupSize}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
