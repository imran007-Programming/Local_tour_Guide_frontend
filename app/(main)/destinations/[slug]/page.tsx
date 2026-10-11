import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { TourCard } from "@/components/home/FeaturedTours";
import { getDestinations, getToursByDestination } from "@/lib/publicApi";

export const revalidate = 300;

export async function generateStaticParams() {
  const destinations = await getDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tours = await getToursByDestination(slug);
  if (tours.length === 0) return { title: "Destination not found" };
  const city = tours[0].city.trim();
  return {
    title: `${city} tours`,
    description: `${tours.length} tour${tours.length === 1 ? "" : "s"} in ${city} led by verified local guides.`,
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tours = await getToursByDestination(slug);
  if (tours.length === 0) notFound();

  const city = tours[0].city.trim();
  const from = Math.min(...tours.map((t) => t.price));
  const cover = tours.find((t) => t.images[0])?.images[0] || "/hero/Hero1.jpg";

  return (
    <div className="container-page pb-24 pt-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/destinations" className="hover:text-zinc-900 dark:hover:text-white">
          Destinations
        </Link>
        <ChevronRight size={14} />
        <span className="truncate text-zinc-900 dark:text-white">{city}</span>
      </nav>

      <header className="relative mt-6 flex min-h-64 items-end overflow-hidden rounded-[1.75rem] bg-slate-100 md:min-h-80 dark:bg-zinc-900">
        <Image
          src={cover}
          alt={city}
          fill
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="relative p-6 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">Destination</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white md:text-5xl">{city}</h1>
          <p className="mt-3 text-sm text-white/85">
            {tours.length} {tours.length === 1 ? "tour" : "tours"} with local guides · from ${from}
          </p>
        </div>
      </header>

      <section className="mt-12">
        <h2 className="section-title">Tours in {city}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour, i) => (
            <TourCard key={tour.id} tour={tour} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
