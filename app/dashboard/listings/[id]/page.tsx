import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import ImageGallery from "./ImageGallery";
import TourActions from "../TourActions";
import { MapPin, Clock, Users, Globe, Tag, Navigation } from "lucide-react";

async function getTour(slug: string) {
  const res = await authFetch(`${BASE_URL}/tour/${slug}`, { cache: "no-store" });
  if (!res?.ok) return null;
  const data = await res.json();
  return data.data;
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await getTour(id);

  if (!tour) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
          <MapPin size={28} className="text-zinc-400" />
        </div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-white">Tour not found</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            {tour.title}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {tour.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {tour.duration}h
            </span>
            <span className="flex items-center gap-1">
              <Users size={14} />
              Max {tour.maxGroupSize}
            </span>
          </div>
        </div>
        <TourActions id={tour.id} slug={id} tourTitle={tour.title} />
      </div>

      {/* Image Gallery */}
      <ImageGallery images={tour.images} title={tour.title} />

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
              Description
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {tour.description}
            </p>
          </div>

          {/* Itinerary */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white mb-3">
              Itinerary
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {tour.itinerary}
            </p>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-5">
          {/* Price Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${tour.price}
              </span>
              <span className="text-sm text-zinc-500">/ person</span>
            </div>
            <div className="space-y-3">
              <InfoRow icon={<Clock size={16} />} label="Duration" value={`${tour.duration} hours`} />
              <InfoRow icon={<Users size={16} />} label="Group Size" value={`Up to ${tour.maxGroupSize}`} />
              <InfoRow icon={<Tag size={16} />} label="Category" value={tour.category} />
              <InfoRow icon={<MapPin size={16} />} label="City" value={tour.city} />
              <InfoRow icon={<Navigation size={16} />} label="Meeting Point" value={tour.meetingPoint} />
              <InfoRow icon={<Globe size={16} />} label="Languages" value={tour.languages.join(", ")} />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
              Status
            </h3>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                tour.isActive
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${tour.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
              {tour.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-zinc-400 mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
