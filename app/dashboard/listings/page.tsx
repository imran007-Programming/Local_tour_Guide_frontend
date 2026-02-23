import Link from "next/link";
import { Plus } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import Image from "next/image";
import { Tour } from "@/types/tours";

async function getTours() {
  const res = await fetch(`${BASE_URL}/tour`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();

  return data.data || [];
}

export default async function ListingsPage() {
  const tours = await getTours();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Listings</h2>
        <Link
          href="/dashboard/listings/create"
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <Plus size={18} />
          Create Tour
        </Link>
      </div>

      {tours.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
          <p className="text-gray-600 dark:text-gray-400">
            No tours created yet
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour: Tour) => {
            const slug = tour.title.toLowerCase().replace(/\s+/g, "-");
            return (
              <Link
                key={tour.id}
                href={`/dashboard/listings/${slug}`}
                className="bg-white dark:bg-zinc-900 rounded-xl shadow overflow-hidden hover:shadow-lg transition"
              >
                <Image
                  src={tour.images[0] || "/placeholder.jpg"}
                  alt={tour.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{tour.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-red-600 font-bold">
                      ${tour.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {tour.duration}h
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
