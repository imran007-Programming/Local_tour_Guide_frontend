import { BASE_URL } from "./config";

// Server-side fetchers for public (no-auth) data. Results are cached and
// revalidated in the background so pages render from cache instead of waiting
// on the backend for every visit.
//
// IMPORTANT: everything returned here may be passed to client components and
// serialised into the page HTML. Each fetcher therefore copies only the fields
// the UI needs, because the API responses include private data (emails and,
// on older backend deploys, password hashes).

export const PUBLIC_REVALIDATE_SECONDS = 300;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Raw = any;

async function getPublic(path: string): Promise<Raw[]> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      next: { revalidate: PUBLIC_REVALIDATE_SECONDS },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export interface TourSummary {
  id: string;
  guideId?: string;
  title: string;
  slug: string;
  price: number;
  duration: number;
  city: string;
  category: string;
  images: string[];
  maxGroupSize: number;
  averageRating?: number;
  reviewCount?: number;
  guide?: { user?: { name?: string } };
}

export interface DestinationSummary {
  slug: string;
  city: string;
  image?: string;
  tours: number;
  from: number;
}

export interface GuideSummary {
  id: string;
  name: string;
  profilePic: string | null;
  bio: string | null;
  languages: string[];
  guide: {
    id: string;
    expertise: string[];
    dailyRate: number;
    _count: { bookings: number; reviews: number };
    averageRating?: number;
    totalReviews?: number;
  };
}

export interface ReviewSummary {
  id: string;
  rating: number;
  comment: string;
  tourist: { user: { name: string; profilePic: string | null } };
  booking: { tour: { title: string; city: string } };
}

const toTour = (t: Raw): TourSummary => ({
  id: t.id,
  guideId: t.guideId,
  title: t.title,
  slug: t.slug,
  price: t.price,
  duration: t.duration,
  city: t.city,
  category: t.category,
  images: Array.isArray(t.images) ? t.images : [],
  maxGroupSize: t.maxGroupSize,
  averageRating: t.averageRating,
  reviewCount: t.reviewCount,
  guide: t.guide?.user?.name ? { user: { name: t.guide.user.name } } : undefined,
});

const toGuide = (g: Raw): GuideSummary => ({
  id: g.id,
  name: g.name,
  profilePic: g.profilePic ?? null,
  bio: g.bio ?? null,
  languages: Array.isArray(g.languages) ? g.languages : [],
  guide: {
    id: g.guide?.id,
    expertise: Array.isArray(g.guide?.expertise) ? g.guide.expertise : [],
    dailyRate: g.guide?.dailyRate ?? 0,
    _count: {
      bookings: g.guide?._count?.bookings ?? 0,
      reviews: g.guide?._count?.reviews ?? 0,
    },
    averageRating: g.guide?.averageRating,
    totalReviews: g.guide?.totalReviews,
  },
});

const toReview = (r: Raw): ReviewSummary => ({
  id: r.id,
  rating: r.rating,
  comment: r.comment,
  tourist: {
    user: {
      name: r.tourist?.user?.name ?? "Traveller",
      profilePic: r.tourist?.user?.profilePic ?? null,
    },
  },
  booking: {
    tour: {
      title: r.booking?.tour?.title ?? "",
      city: r.booking?.tour?.city ?? "",
    },
  },
});

export async function getLatestTours(limit = 6) {
  const tours = await getPublic(`/tour?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
  // The API does not always honour `limit`
  return tours.slice(0, limit).map(toTour);
}

export async function getGuides(): Promise<GuideSummary[]> {
  return (await getPublic("/guides?limit=100")).map(toGuide);
}

/** URL slug for a guide's profile page, e.g. "Imran Hasan" -> "imran-hasan". */
export const guideSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, "-");

export async function getGuideBySlug(slug: string) {
  const guides = await getGuides();
  const decoded = decodeURIComponent(slug);
  return (
    guides.find(
      (g) =>
        guideSlug(g.name) === decoded ||
        // links generated before names were trimmed, e.g. "jessica-"
        g.name.toLowerCase().replace(/\s+/g, "-") === decoded ||
        g.id === decoded ||
        g.guide?.id === decoded,
    ) ?? null
  );
}

// The tour API has no guide or exact-city filter, so pages filter this cached full list
async function getAllTours() {
  return (await getPublic("/tour?limit=100")).map(toTour);
}

export async function getToursByGuide(guideId: string) {
  return (await getAllTours()).filter((t) => t.guideId === guideId);
}

/** URL slug for a destination page, e.g. "Cox's Bazar" -> "coxs-bazar", "Göreme" -> "goreme". */
export const destinationSlug = (city: string) => {
  const name = city.trim().toLowerCase();
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  // Names with no Latin letters would otherwise all collapse to ""
  return slug || name;
};

/** One entry per city that has at least one tour, busiest first. */
export async function getDestinations(): Promise<DestinationSummary[]> {
  const bySlug = new Map<string, DestinationSummary>();
  for (const t of await getAllTours()) {
    const city = t.city?.trim();
    if (!city) continue;
    const slug = destinationSlug(city);
    const d = bySlug.get(slug);
    if (d) {
      d.tours += 1;
      d.from = Math.min(d.from, t.price);
      d.image ??= t.images[0];
    } else {
      bySlug.set(slug, { slug, city, image: t.images[0], tours: 1, from: t.price });
    }
  }
  return [...bySlug.values()].sort((a, b) => b.tours - a.tours || a.city.localeCompare(b.city));
}

export async function getToursByDestination(slug: string) {
  const decoded = decodeURIComponent(slug);
  return (await getAllTours()).filter((t) => t.city && destinationSlug(t.city) === decoded);
}

export async function getReviews(): Promise<ReviewSummary[]> {
  return (await getPublic("/reviews")).map(toReview);
}

export async function getTourCategories(): Promise<string[]> {
  return (await getPublic("/tour/categories")).filter((c) => typeof c === "string");
}
