import type { Metadata } from "next";
import { getGuides } from "@/lib/publicApi";
import GuidesDirectory from "./GuidesDirectory";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Local guides",
  description: "Browse verified local guides and find the right person to show you their city.",
};

export default async function GuidesPage() {
  const guides = await getGuides();

  return (
    <div className="container-page pb-24 pt-10 md:pt-14">
      <header className="mb-8 max-w-2xl">
        <p className="eyebrow">Local guides</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-white">
          Find a guide who knows the city
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Every guide is verified and reviewed by travellers. Filter by what you love and
          see who fits your trip.
        </p>
      </header>

      <GuidesDirectory initialGuides={guides} />
    </div>
  );
}
