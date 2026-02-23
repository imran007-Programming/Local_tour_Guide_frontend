import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import ImageGallery from "./ImageGallery";
import TourActions from "../TourActions";

async function getTour(slug: string) {
  const res = await authFetch(`${BASE_URL}/tour/${slug}`, {
    cache: "no-store",
  });
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
    return <div>Tour not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{tour.title}</h1>
        <TourActions id={tour.id} slug={id} tourTitle={tour.title} />
      </div>

      <ImageGallery images={tour.images} title={tour.title} />

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-red-600">${tour.price}</span>
          <span className="text-gray-600">{tour.duration} hours</span>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-gray-600 dark:text-gray-400">{tour.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-1">City</h3>
            <p className="text-gray-600">{tour.city}</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Meeting Point</h3>
            <p className="text-gray-600">{tour.meetingPoint}</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Max Group Size</h3>
            <p className="text-gray-600">{tour.maxGroupSize} people</p>
          </div>
          <div>
            <h3 className="font-bold mb-1">Category</h3>
            <p className="text-gray-600">{tour.category}</p>
          </div>
        </div>

        <div>
          <h3 className="font-bold mb-1">Languages</h3>
          <p className="text-gray-600">{tour.languages.join(", ")}</p>
        </div>

        <div>
          <h3 className="font-bold mb-2">Itinerary</h3>
          <p className="text-gray-600 whitespace-pre-line">{tour.itinerary}</p>
        </div>
      </div>
    </div>
  );
}
