import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Users } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration: number;
  city: string;
  images: string[];
  maxGroupSize: number;
}

export default function TourCard({ tour }: { tour: Tour }) {
  return (
    <Link href={`/tours/${tour.slug}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden">
        <Image
          src={tour.images[0] || "/placeholder.jpg"}
          alt={tour.title}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{tour.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{tour.city}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration}h</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{tour.maxGroupSize}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-red-600">${tour.price}</span>
            <span className="text-sm text-gray-500">per person</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
