import Link from "next/link";
import { BASE_URL } from "@/lib/config";
import { getGuides } from "@/lib/publicApi";
import TourPageContent, { type TourDetails } from "./TourPageContent";

export const revalidate = 3600;

// The tour is passed to a client component and serialised into the HTML, so
// copy only public fields. The raw API response includes the guide's email and
// (on older backend deploys) password hash.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toTourDetails(t: any): TourDetails {
  return {
    id: t.id,
    guideId: t.guideId,
    title: t.title,
    description: t.description,
    itinerary: t.itinerary,
    meetingPoint: t.meetingPoint,
    city: t.city,
    category: t.category,
    price: t.price,
    duration: t.duration,
    maxGroupSize: t.maxGroupSize,
    languages: Array.isArray(t.languages) ? t.languages : [],
    images: Array.isArray(t.images) ? t.images : [],
    guide: {
      dailyRate: t.guide?.dailyRate ?? 0,
      expertise: Array.isArray(t.guide?.expertise) ? t.guide.expertise : [],
      user: {
        id: t.guide?.user?.id,
        name: t.guide?.user?.name ?? "Local guide",
        profilePic: t.guide?.user?.profilePic ?? null,
        bio: t.guide?.user?.bio ?? null,
        languages: Array.isArray(t.guide?.user?.languages) ? t.guide.user.languages : [],
      },
    },
  };
}

async function getTour(slug: string) {
  const res = await fetch(`${BASE_URL}/tour/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res?.ok) return null;
  const data = await res.json();
  return data.data ? toTourDetails(data.data) : null;
}

// /guides/:id doesn't return ratings, so read them from the cached guide list
async function getGuideRating(guideId: string) {
  const guide = (await getGuides()).find((g) => g.guide.id === guideId);
  return guide
    ? { averageRating: guide.guide.averageRating, totalReviews: guide.guide.totalReviews }
    : null;
}

export async function generateStaticParams() {
  try {
    const limit = 100;
    const firstRes = await fetch(`${BASE_URL}/tour?limit=${limit}&page=1`);
    if (!firstRes.ok) return [];
    const firstData = await firstRes.json();
    const tours: { slug: string }[] = firstData.data || [];
    const total: number = firstData.meta?.total || 0;

    if (total > limit) {
      const totalPages = Math.ceil(total / limit);
      const rest = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) =>
          fetch(`${BASE_URL}/tour?limit=${limit}&page=${i + 2}`)
            .then((r) => (r.ok ? r.json() : { data: [] }))
            .then((d) => (d.data || []) as { slug: string }[])
        )
      );
      tours.push(...rest.flat());
    }

    return tours.map((tour) => ({ id: tour.slug }));
  } catch {
    return [];
  }
}

export default async function TourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Tour not found</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          This tour may have been removed or the link is incorrect.
        </p>
        <Link
          href="/explore"
          className="mt-6 rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Browse tours
        </Link>
      </div>
    );
  }

  const guideRating = await getGuideRating(tour.guideId);

  return <TourPageContent tour={tour} guideRating={guideRating} />;
}
