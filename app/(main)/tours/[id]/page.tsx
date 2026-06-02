import { BASE_URL } from "@/lib/config";
import TourPageContent from "./TourPageContent";

export const revalidate = 3600;

async function getTour(slug: string) {
  const res = await fetch(`${BASE_URL}/tour/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res?.ok) return null;
  const data = await res.json();
  return data.data;
}

async function getGuideRating(guideId: string) {
  const res = await fetch(`${BASE_URL}/guides/${guideId}`, {
    next: { revalidate: 3600 },
  });
  if (!res?.ok) return null;
  const data = await res.json();
  return data.data;
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
    return <div className="max-w-6xl mx-auto p-6">Tour not found</div>;
  }

  const guideRating = await getGuideRating(tour.guideId);

  return <TourPageContent tour={tour} guideRating={guideRating} />;
}
