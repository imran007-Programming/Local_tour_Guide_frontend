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
      <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300">
        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={tour.images[0] || "/placeholder.jpg"}
            alt={tour.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Price badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              ${tour.price}
            </span>
            <span className="text-xs text-zinc-500"> /person</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5">
          <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition line-clamp-1">
            {tour.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {tour.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {tour.duration}h
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              Max {tour.maxGroupSize}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
