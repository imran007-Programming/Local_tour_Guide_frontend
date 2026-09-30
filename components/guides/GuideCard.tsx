"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { guideSlug, type GuideSummary } from "@/lib/publicApi";

const FALLBACK = "/avatar.png";

export default function GuideCard({
  guide,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
}: {
  guide: GuideSummary;
  sizes?: string;
}) {
  const [imgSrc, setImgSrc] = useState(guide.profilePic || FALLBACK);
  const rating = guide.guide.averageRating ?? 0;
  const reviews = guide.guide.totalReviews ?? 0;
  const languages = guide.languages.filter(Boolean);
  const expertise = guide.guide.expertise.filter(Boolean);

  return (
    <Link href={`/guides/${guideSlug(guide.name)}`} className="group block">
      <div className="relative aspect-4/5 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imgSrc}
          alt={guide.name}
          fill
          sizes={sizes}
          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setImgSrc(FALLBACK)}
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <h3 className="truncate font-medium capitalize text-zinc-900 dark:text-white">
          {guide.name.trim()}
        </h3>
        {rating > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            <Star size={13} className="fill-zinc-900 text-zinc-900 dark:fill-white dark:text-white" />
            {rating.toFixed(1)}
            {reviews > 0 && <span className="text-zinc-400">({reviews})</span>}
          </span>
        )}
      </div>

      {expertise.length > 0 && (
        <p className="mt-1 line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
          {expertise.slice(0, 3).join(" · ")}
        </p>
      )}
      {languages.length > 0 && (
        <p className="line-clamp-1 text-sm text-zinc-500 dark:text-zinc-400">
          Speaks {languages.slice(0, 3).join(", ")}
        </p>
      )}

      {guide.guide.dailyRate > 0 && (
        <p className="mt-2 text-sm text-zinc-900 dark:text-white">
          <span className="font-semibold">${guide.guide.dailyRate}</span>
          <span className="text-zinc-500 dark:text-zinc-400"> / day</span>
        </p>
      )}
    </Link>
  );
}

export function GuideCardSkeleton() {
  return (
    <div>
      <div className="aspect-4/5 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900" />
      </div>
    </div>
  );
}
