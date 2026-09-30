"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Share,
  Globe,
  Tag,
  Grid3X3,
  ChevronRight,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { guideSlug } from "@/lib/publicApi";
import BookingButton from "./BookingButton";
import TourReviews from "./TourReviews";
import WishlistButton from "./WishlistButton";
import ContactGuideButton from "./ContactGuideButton";
import { motion } from "framer-motion";

const formatLabel = (value?: string) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase() : "";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-zinc-200 py-10 dark:border-zinc-800">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Photo grid adapts to how many side photos there are (0, 1, 2 or 4)
const galleryLayouts: Record<number, { grid: string; main: string; side: string }> = {
  0: { grid: "", main: "md:row-span-2", side: "" },
  1: { grid: "md:grid-cols-2", main: "md:row-span-2", side: "md:row-span-2" },
  2: { grid: "md:grid-cols-3", main: "md:col-span-2 md:row-span-2", side: "" },
  4: { grid: "md:grid-cols-4", main: "md:col-span-2 md:row-span-2", side: "" },
};

export interface TourDetails {
  id: string;
  guideId: string;
  title: string;
  description: string;
  itinerary?: string;
  meetingPoint?: string;
  city: string;
  category: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  languages: string[];
  images: string[];
  guide: {
    dailyRate: number;
    expertise: string[];
    user: {
      id: string;
      name: string;
      profilePic: string | null;
      bio?: string | null;
      languages?: string[];
    };
  };
}

interface GuideRating {
  averageRating?: number;
  totalReviews?: number;
}

export default function TourPageContent({
  tour,
  guideRating,
}: {
  tour: TourDetails;
  guideRating: GuideRating | null;
}) {
  const userRole = useCurrentUser()?.data?.role;
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: tour.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied");
      }
    } catch {
      // user dismissed the share sheet
    }
  };

  const avgRating = guideRating?.averageRating || 0;
  const totalReviews = guideRating?.totalReviews || 0;
  const images: string[] = tour.images?.length ? tour.images : ["/placeholder.jpg"];
  const sideCount = images.length - 1 >= 4 ? 4 : Math.min(images.length - 1, 2);
  const sideImages = images.slice(1, 1 + sideCount);
  const layout = galleryLayouts[sideCount];
  const canBook = !userRole || userRole === "TOURIST";
  const guide = tour.guide;

  const facts = [
    { icon: Clock, label: "Duration", value: `${tour.duration} hours` },
    { icon: Users, label: "Group size", value: `Up to ${tour.maxGroupSize}` },
    { icon: Globe, label: "Languages", value: tour.languages.join(", ") },
    { icon: Tag, label: "Category", value: formatLabel(tour.category) },
  ];

  return (
    <>
      <div className="container-page pb-28 pt-6 lg:pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/explore" className="hover:text-zinc-900 dark:hover:text-white">
            Explore
          </Link>
          <ChevronRight size={14} />
          <span className="truncate text-zinc-900 dark:text-white">{tour.city}</span>
        </nav>

        {/* Title */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-semibold leading-tight text-zinc-900 md:text-4xl dark:text-white">
              {tour.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              {avgRating > 0 && (
                <>
                  <span className="flex items-center gap-1 font-medium text-zinc-900 dark:text-white">
                    <Star size={14} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <a href="#reviews" className="underline underline-offset-4">
                    {totalReviews} review{totalReviews === 1 ? "" : "s"}
                  </a>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                </>
              )}
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {tour.city}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <Share size={15} />
              Share
            </button>
            <WishlistButton tourId={tour.id} userRole={userRole} />
          </div>
        </div>

        {/* Photos */}
        <div className="relative mt-6 overflow-hidden rounded-2xl">
          <div className={`grid h-72 grid-cols-1 gap-2 sm:h-96 md:grid-rows-2 lg:h-115 ${layout.grid}`}>
            <button
              type="button"
              onClick={() => setShowAllPhotos(true)}
              className={`group relative bg-zinc-100 dark:bg-zinc-900 ${layout.main}`}
            >
              <Image
                src={images[0]}
                alt={tour.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-300 group-hover:brightness-95"
                priority
              />
            </button>
            {sideImages.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setShowAllPhotos(true)}
                className={`group relative hidden bg-zinc-100 md:block dark:bg-zinc-900 ${layout.side}`}
              >
                <Image
                  src={img}
                  alt={`${tour.title} photo ${i + 2}`}
                  fill
                  sizes="25vw"
                  className="object-cover transition duration-300 group-hover:brightness-95"
                />
              </button>
            ))}
          </div>
          {images.length > 1 && (
            <button
              onClick={() => setShowAllPhotos(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            >
              <Grid3X3 size={15} />
              Show all {images.length} photos
            </button>
          )}
        </div>

        {/* Main content */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <div className="min-w-0">
            {/* Host */}
            <div className="flex items-center justify-between gap-4 pb-8">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Hosted by {guide.user.name}
                </h2>
                {guide.expertise?.length > 0 && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {guide.expertise.slice(0, 3).join(" · ")}
                  </p>
                )}
              </div>
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                <Image
                  src={guide.user.profilePic || "/avatar.png"}
                  alt={guide.user.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200 md:grid-cols-4 dark:border-zinc-800">
              {facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`p-4 ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t md:border-t-0" : ""} ${
                    i === 2 ? "md:border-l" : ""
                  } border-zinc-200 dark:border-zinc-800`}
                >
                  <f.icon size={18} strokeWidth={1.75} className="text-zinc-900 dark:text-white" />
                  <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{f.label}</p>
                  <p className="mt-0.5 truncate text-sm font-medium text-zinc-900 dark:text-white">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Section title="About this tour">
                <p className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {tour.description}
                </p>
              </Section>

              {tour.itinerary && (
                <Section title="What you’ll do">
                  <p className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {tour.itinerary}
                  </p>
                </Section>
              )}

              {tour.meetingPoint && (
                <Section title="Where you’ll meet">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
                      <MapPin size={18} strokeWidth={1.75} className="text-zinc-900 dark:text-white" />
                    </span>
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">{tour.meetingPoint}</p>
                      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{tour.city}</p>
                    </div>
                  </div>
                </Section>
              )}

              <Section title="Meet your guide">
                <div className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={guide.user.profilePic || "/avatar.png"}
                        alt={guide.user.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {guide.user.name}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-zinc-500 dark:text-zinc-400">
                        {avgRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={13} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                            {avgRating.toFixed(1)} ({totalReviews})
                          </span>
                        )}
                        {guide.dailyRate > 0 && <span>${guide.dailyRate}/day</span>}
                      </div>
                    </div>
                  </div>

                  {guide.user.bio && (
                    <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {guide.user.bio}
                    </p>
                  )}

                  {guide.expertise?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {guide.expertise.map((exp: string) => (
                        <span
                          key={exp}
                          className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(guide.user.languages) && guide.user.languages.length > 0 && (
                    <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                      Speaks {guide.user.languages.join(", ")}
                    </p>
                  )}

                  <Link
                    href={`/guides/${guideSlug(guide.user.name)}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-white"
                  >
                    View full profile
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </Section>

              <section id="reviews" className="scroll-mt-24 border-t border-zinc-200 py-10 dark:border-zinc-800">
                <TourReviews tourId={tour.id} userRole={userRole} />
              </section>
            </div>
          </div>

          {/* Booking card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
              <div className="flex items-baseline justify-between">
                <p className="text-zinc-900 dark:text-white">
                  <span className="text-2xl font-semibold">${tour.price}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400"> / person</span>
                </p>
                {avgRating > 0 && (
                  <span className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <Star size={13} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                    {avgRating.toFixed(1)}
                  </span>
                )}
              </div>

              <dl className="mt-5 divide-y divide-zinc-200 rounded-xl border border-zinc-200 text-sm dark:divide-zinc-800 dark:border-zinc-800">
                {facts.slice(0, 2).map((f) => (
                  <div key={f.label} className="flex items-center justify-between px-4 py-3">
                    <dt className="text-zinc-500 dark:text-zinc-400">{f.label}</dt>
                    <dd className="font-medium text-zinc-900 dark:text-white">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {canBook ? (
                <div className="mt-5 space-y-2">
                  <BookingButton tourId={tour.id} userRole={userRole} className="w-full" />
                  <ContactGuideButton
                    guideId={guide.user.id}
                    guideName={guide.user.name}
                    guideProfilePic={guide.user.profilePic}
                    userRole={userRole}
                  />
                  <p className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
                    Your guide confirms the booking before you pay.
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Booking is available for traveller accounts.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      {canBook && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="container-page flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-zinc-900 dark:text-white">
                <span className="font-semibold">${tour.price}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400"> / person</span>
              </p>
              {avgRating > 0 && (
                <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Star size={11} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                  {avgRating.toFixed(1)} · {totalReviews} reviews
                </p>
              )}
            </div>
            <BookingButton tourId={tour.id} userRole={userRole} className="px-6" />
          </div>
        </div>
      )}

      {/* All photos */}
      {showAllPhotos && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-9999 overflow-y-auto bg-white dark:bg-zinc-950"
        >
          <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="container-page flex h-14 items-center justify-between">
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {images.length} photo{images.length === 1 ? "" : "s"}
              </p>
              <button
                onClick={() => setShowAllPhotos(false)}
                aria-label="Close photos"
                className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl gap-2 px-4 py-8 sm:grid-cols-2">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative aspect-4/3 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 ${
                  i % 3 === 0 ? "sm:col-span-2" : ""
                }`}
              >
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
