import type { Metadata } from "next";
import Link from "next/link";
import DestinationCard from "@/components/destinations/DestinationCard";
import { getDestinations } from "@/lib/publicApi";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Destinations",
  description: "Every place where our local guides run tours. Pick a destination to see what you can do there.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  const tourCount = destinations.reduce((sum, d) => sum + d.tours, 0);

  return (
    <div className="container-page pb-24 pt-10 md:pt-14">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Destinations</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
          Where do you want to go?
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          {destinations.length > 0
            ? `${destinations.length} destinations and ${tourCount} tours with local guides. Pick a place to see what you can do there.`
            : "Pick a place to see what you can do there."}
        </p>
      </header>

      {destinations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d, i) => (
            <DestinationCard key={d.slug} d={d} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800">
          <p className="font-medium text-zinc-900 dark:text-white">No destinations yet</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Check back soon, or{" "}
            <Link href="/explore" className="font-medium text-zinc-900 underline underline-offset-4 dark:text-white">
              browse all tours
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
