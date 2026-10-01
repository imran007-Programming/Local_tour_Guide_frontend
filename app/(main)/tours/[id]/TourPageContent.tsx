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
  Languages,
  ShieldCheck,
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

const card =
  "rounded-3xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60";

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-8">
      <p className="eyebrow text-blue-500!">{eyebrow}</p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

// "08:00 Pickup; 09:00 Terraces" or one step per line -> timeline steps.
// Anything that doesn't split into 2+ steps stays a normal paragraph.
function parseItinerary(text: string) {
  const parts = text
    .split(/\s*;\s*|\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;
  return parts.map((p) => {
    const m = p.match(/^((?:day\s*\d+)|(?:\d{1,2}:\d{2}))\s*[:\-–]?\s*(.+)$/i);
    return m ? { label: m[1], text: m[2] } : { label: "", text: p };
  });
}

function Rating({
  avg,
  total,
  className = "",
}: {
  avg: number;
  total: number;
  className?: string;
}) {
  if (avg <= 0) return null;
  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <Star size={14} className="fill-amber-400 text-amber-400" />
      <span className="font-medium">{avg.toFixed(1)}</span>
      <a href="#reviews" className="underline underline-offset-4">
        ({total})
      </a>
    </span>
  );
}

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
  const [activeImage, setActiveImage] = useState(0);

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
  const thumbs = images.slice(0, 5);
  const hiddenCount = images.length - thumbs.length;
  const canBook = !userRole || userRole === "TOURIST";
  const guide = tour.guide;
  const steps = tour.itinerary ? parseItinerary(tour.itinerary) : null;

  const facts = [
    { icon: Clock, label: "Duration", value: `${tour.duration} ${tour.duration === 1 ? "hour" : "hours"}` },
    { icon: Users, label: "Group size", value: `Up to ${tour.maxGroupSize}` },
    { icon: Globe, label: "Languages", value: tour.languages.join(", ") },
    { icon: Tag, label: "Category", value: formatLabel(tour.category) },
  ];

  return (
    <>
      <div className="container-page pb-28 pt-6 lg:pb-20">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
            <Link href="/explore" className="hover:text-slate-950 dark:hover:text-white">
              Explore
            </Link>
            <ChevronRight size={14} />
            <span className="truncate text-slate-950 dark:text-white">{tour.city}</span>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={handleShare}
              className="flex h-9 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              <Share size={15} />
              Share
            </button>
            <WishlistButton tourId={tour.id} userRole={userRole} />
          </div>
        </div>

        {/* Hero */}
        <div className="mt-5">
          <div className="relative isolate flex min-h-104 items-end overflow-hidden rounded-[1.75rem] sm:min-h-120 sm:rounded-[2rem] lg:min-h-136">
            {images.map((img, i) => (
              <Image
                key={img + i}
                src={img}
                alt={i === activeImage ? tour.title : ""}
                aria-hidden={i !== activeImage}
                fill
                priority={i === 0}
                sizes="(max-width: 1152px) 100vw, 1152px"
                className="-z-20 object-cover transition-opacity duration-700"
                style={{ opacity: i === activeImage ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-slate-950/10" />

            <button
              type="button"
              aria-label="Open photo gallery"
              onClick={() => setShowAllPhotos(true)}
              className="absolute inset-0 -z-5 cursor-zoom-in"
            />

            <div className="pointer-events-none w-full p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white">
                  {formatLabel(tour.category)}
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  <MapPin size={12} />
                  {tour.city}
                </span>
                <Rating avg={avgRating} total={totalReviews} className="rounded-full bg-white/20 px-3 py-1 text-xs text-white backdrop-blur [&_a]:pointer-events-auto" />
              </div>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.1] tracking-tight text-white drop-shadow sm:text-5xl">
                {tour.title}
              </h1>
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {tour.duration} {tour.duration === 1 ? "hour" : "hours"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} />
                  Up to {tour.maxGroupSize} guests
                </span>
                <span className="flex items-center gap-1.5">
                  <Languages size={14} />
                  {tour.languages.slice(0, 3).join(" · ")}
                </span>
              </p>
            </div>

            {images.length > 1 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-slate-950 shadow-sm backdrop-blur transition hover:bg-white sm:right-6 sm:top-6"
              >
                <Grid3X3 size={15} />
                {images.length} photos
              </button>
            )}
          </div>

          {/* Thumbnails switch the hero photo */}
          {thumbs.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
              {thumbs.map((img, i) => {
                const last = i === thumbs.length - 1 && hiddenCount > 0;
                return (
                  <button
                    type="button"
                    key={img + i}
                    onClick={() => (last ? setShowAllPhotos(true) : setActiveImage(i))}
                    aria-label={last ? `Show all ${images.length} photos` : `Show photo ${i + 1}`}
                    className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100 ring-2 ring-offset-2 ring-offset-white transition dark:bg-zinc-900 dark:ring-offset-zinc-950 ${
                      i === activeImage && !last ? "ring-blue-500" : "ring-transparent hover:ring-slate-300"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="20vw" className="object-cover" />
                    {last && (
                      <span className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-sm font-semibold text-white">
                        +{hiddenCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div className="min-w-0">
            {/* Key facts */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className={`${card} p-4`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-500/15">
                    <f.icon size={18} strokeWidth={1.75} />
                  </span>
                  <p className="mt-3 text-xs text-slate-500 dark:text-zinc-400">{f.label}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-950 dark:text-white">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-slate-200 dark:divide-zinc-800">
              <Section eyebrow="Overview" title="About this tour">
                <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-zinc-400">
                  {tour.description}
                </p>
              </Section>

              {tour.itinerary && (
                <Section eyebrow="Itinerary" title="What you’ll do">
                  {steps ? (
                    <ol className="relative space-y-6 border-l-2 border-blue-100 pl-8 dark:border-blue-500/20">
                      {steps.map((s, i) => (
                        <li key={i} className="relative">
                          <span className="absolute -left-[2.6rem] flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[11px] font-semibold text-white ring-4 ring-white dark:ring-zinc-950">
                            {i + 1}
                          </span>
                          {s.label && (
                            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                              {s.label}
                            </p>
                          )}
                          <p className="mt-0.5 leading-relaxed text-slate-700 dark:text-zinc-300">
                            {s.text}
                          </p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-zinc-400">
                      {tour.itinerary}
                    </p>
                  )}
                </Section>
              )}

              {tour.meetingPoint && (
                <Section eyebrow="Meeting point" title="Where you’ll meet">
                  <div className={`${card} flex items-center gap-4 p-5`}>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                      <MapPin size={20} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-950 dark:text-white">
                        {tour.meetingPoint}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500 dark:text-zinc-400">{tour.city}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${tour.meetingPoint}, ${tour.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto hidden shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:block dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      Open map
                    </a>
                  </div>
                </Section>
              )}

              <Section eyebrow="Your host" title="Meet your guide">
                <div className={`${card} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:bg-zinc-900 dark:ring-offset-zinc-900">
                      <Image
                        src={guide.user.profilePic || "/avatar.png"}
                        alt={guide.user.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                        {guide.user.name}
                      </h3>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-slate-500 dark:text-zinc-400">
                        {avgRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star size={13} className="fill-amber-400 text-amber-400" />
                            {avgRating.toFixed(1)} ({totalReviews})
                          </span>
                        )}
                        {guide.dailyRate > 0 && <span>${guide.dailyRate}/day</span>}
                      </div>
                    </div>
                    <Link
                      href={`/guides/${guideSlug(guide.user.name)}`}
                      className="ml-auto hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:inline-flex dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      View profile
                      <ChevronRight size={14} />
                    </Link>
                  </div>

                  {guide.user.bio && (
                    <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                      {guide.user.bio}
                    </p>
                  )}

                  {guide.expertise?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {guide.expertise.map((exp: string) => (
                        <span
                          key={exp}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-500/15 dark:text-blue-300"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}

                  {Array.isArray(guide.user.languages) && guide.user.languages.length > 0 && (
                    <p className="mt-4 text-sm text-slate-500 dark:text-zinc-400">
                      Speaks {guide.user.languages.join(", ")}
                    </p>
                  )}

                  <Link
                    href={`/guides/${guideSlug(guide.user.name)}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-500 hover:underline sm:hidden"
                  >
                    View full profile
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </Section>

              <section id="reviews" className="scroll-mt-24 py-8">
                <TourReviews tourId={tour.id} userRole={userRole} />
              </section>
            </div>
          </div>

          {/* Booking card */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="bg-slate-950 px-6 py-5 text-white">
                <p className="text-xs uppercase tracking-[0.14em] text-white/60">From</p>
                <div className="mt-1 flex items-end justify-between">
                  <p>
                    <span className="text-4xl font-semibold">${tour.price}</span>
                    <span className="text-sm text-white/60"> / person</span>
                  </p>
                  {avgRating > 0 && (
                    <span className="flex items-center gap-1 pb-1 text-sm text-white/80">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      {avgRating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <dl className="space-y-3 text-sm">
                  {facts.slice(0, 3).map((f) => (
                    <div key={f.label} className="flex items-center justify-between gap-4">
                      <dt className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                        <f.icon size={15} />
                        {f.label}
                      </dt>
                      <dd className="truncate text-right font-medium text-slate-950 dark:text-white">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {canBook ? (
                  <div className="mt-6 space-y-2.5">
                    <BookingButton tourId={tour.id} userRole={userRole} className="w-full" />
                    <ContactGuideButton
                      guideId={guide.user.id}
                      guideName={guide.user.name}
                      guideProfilePic={guide.user.profilePic}
                      userRole={userRole}
                    />
                    <p className="flex items-center justify-center gap-1.5 pt-2 text-xs text-slate-500 dark:text-zinc-400">
                      <ShieldCheck size={14} className="text-blue-500" />
                      Your guide confirms the booking before you pay.
                    </p>
                  </div>
                ) : (
                  <p className="mt-6 text-center text-sm text-slate-500 dark:text-zinc-400">
                    Booking is available for traveller accounts.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      {canBook && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/95">
          <div className="container-page flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-slate-950 dark:text-white">
                <span className="text-lg font-semibold">${tour.price}</span>
                <span className="text-sm text-slate-500 dark:text-zinc-400"> / person</span>
              </p>
              {avgRating > 0 && (
                <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  {avgRating.toFixed(1)} · {totalReviews} reviews
                </p>
              )}
            </div>
            <BookingButton tourId={tour.id} userRole={userRole} className="px-8" />
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
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="container-page flex h-14 items-center justify-between">
              <p className="text-sm font-medium text-slate-950 dark:text-white">
                {images.length} photo{images.length === 1 ? "" : "s"}
              </p>
              <button
                onClick={() => setShowAllPhotos(false)}
                aria-label="Close photos"
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="mx-auto grid max-w-4xl gap-2 px-4 py-8 sm:grid-cols-2">
            {images.map((img, i) => (
              <div
                key={i}
                className={`relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-900 ${
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
