import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronRight, Star } from "lucide-react";
import { TourCard } from "@/components/home/FeaturedTours";
import { getGuideBySlug, getGuides, getToursByGuide, guideSlug } from "@/lib/publicApi";
import GuideActions from "./GuideActions";

export const revalidate = 300;

export async function generateStaticParams() {
  const guides = await getGuides();
  return guides.map((g) => ({ id: guideSlug(g.name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const guide = await getGuideBySlug(id);
  if (!guide) return { title: "Guide not found" };
  return {
    title: `${guide.name.trim()} · Local guide`,
    description: guide.bio ?? `Book a tour with ${guide.name.trim()}, a verified local guide.`,
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-zinc-200 py-8 dark:border-zinc-800">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function GuideProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = await getGuideBySlug(id);
  if (!guide) notFound();

  const tours = await getToursByGuide(guide.guide.id);

  const name = guide.name.trim();
  const rating = guide.guide.averageRating ?? 0;
  const totalReviews = guide.guide.totalReviews ?? 0;
  const rate = guide.guide.dailyRate ?? 0;
  const expertise = guide.guide.expertise.filter(Boolean);
  const languages = guide.languages.filter(Boolean);
  const trips = guide.guide._count?.bookings ?? 0;

  const stats = [
    { label: "Tours", value: tours.length },
    { label: "Trips hosted", value: trips },
    { label: "Reviews", value: totalReviews },
    { label: "Rating", value: rating > 0 ? rating.toFixed(1) : "New" },
  ];

  return (
    <div className="container-page pb-24 pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/guides" className="hover:text-zinc-900 dark:hover:text-white">
          Guides
        </Link>
        <ChevronRight size={14} />
        <span className="truncate capitalize text-zinc-900 dark:text-white">{name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-16">
        {/* Photo + actions */}
        <aside>
          <div className="lg:sticky lg:top-24">
            <div className="relative mx-auto aspect-4/5 max-w-sm overflow-hidden rounded-2xl bg-zinc-100 lg:max-w-none dark:bg-zinc-900">
              <Image
                src={guide.profilePic || "/avatar.png"}
                alt={name}
                fill
                priority
                sizes="(min-width: 1024px) 340px, 384px"
                className="object-cover object-top"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
              {rate > 0 && (
                <p className="mb-4 text-zinc-900 dark:text-white">
                  <span className="text-2xl font-semibold">${rate}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400"> / day</span>
                </p>
              )}
              <GuideActions
                guideUserId={guide.id}
                guideName={name}
                guideProfilePic={guide.profilePic}
                tourCount={tours.length}
              />
            </div>
          </div>
        </aside>

        {/* Details */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold capitalize text-zinc-900 md:text-4xl dark:text-white">
              {name}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              <BadgeCheck size={13} className="text-emerald-500" />
              Verified guide
            </span>
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-zinc-600 dark:text-zinc-400">
            {rating > 0 && (
              <>
                <span className="flex items-center gap-1 font-medium text-zinc-900 dark:text-white">
                  <Star size={14} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
                  {rating.toFixed(1)}
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span>
                  {totalReviews} review{totalReviews === 1 ? "" : "s"}
                </span>
                {languages.length > 0 && <span className="text-zinc-300 dark:text-zinc-700">·</span>}
              </>
            )}
            {languages.length > 0 && <span>Speaks {languages.join(", ")}</span>}
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 overflow-hidden rounded-2xl border border-zinc-200 sm:grid-cols-4 dark:border-zinc-800">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`border-zinc-200 p-4 dark:border-zinc-800 ${i % 2 === 1 ? "border-l" : ""} ${
                  i >= 2 ? "border-t sm:border-t-0" : ""
                } ${i === 2 ? "sm:border-l" : ""}`}
              >
                <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{s.value}</p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Section title={`About ${name.split(" ")[0]}`}>
              <p className="whitespace-pre-line leading-relaxed text-zinc-600 dark:text-zinc-400">
                {guide.bio || `${name} hasn't written a bio yet.`}
              </p>
            </Section>

            {expertise.length > 0 && (
              <Section title="Expertise">
                <div className="flex flex-wrap gap-2">
                  {expertise.map((exp) => (
                    <span
                      key={exp}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {languages.length > 0 && (
              <Section title="Languages">
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>

      {/* Tours */}
      <section id="tours" className="mt-16 scroll-mt-24 border-t border-zinc-200 pt-12 dark:border-zinc-800">
        <h2 className="section-title capitalize">Tours by {name.split(" ")[0]}</h2>
        {tours.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour, i) => (
              <TourCard key={tour.id} tour={tour} index={i} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
            <p className="font-medium text-zinc-900 dark:text-white">No tours listed yet</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Send a message to plan a private trip, or{" "}
              <Link href="/explore" className="font-medium text-zinc-900 underline underline-offset-4 dark:text-white">
                browse other tours
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
