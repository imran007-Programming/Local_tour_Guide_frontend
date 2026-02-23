import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import Image from "next/image";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import BookingButton from "./BookingButton";

async function getTour(slug: string) {
  const res = await authFetch(`${BASE_URL}/tour/${slug}`, {
    cache: "no-store",
  });
  if (!res?.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const tour = await getTour(slug);
  const user = await getCurrentUser();
  if (!tour) {
    return <div className="max-w-6xl mx-auto p-6">Tour not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 mt-10">
      {/* Hero Image */}
      <div className="relative h-[60vh] rounded-2xl overflow-hidden">
        <Image
          src={tour.images[0] || "/placeholder.jpg"}
          alt={tour.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold">{tour.title}</h1>

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

          {/* Image Gallery */}
          {tour.images.length > 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-3">Gallery</h2>
              <div className="grid grid-cols-3 gap-4">
                {tour.images.slice(1).map((img: string, i: number) => (
                  <div
                    key={i}
                    className="relative h-48 rounded-lg overflow-hidden"
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="text-3xl font-bold text-red-600">${tour.price}</div>
            <p className="text-gray-600 dark:text-gray-400">per person</p>

            <BookingButton tourId={tour.id} userRole={user?.data?.role} />

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
  );
}
