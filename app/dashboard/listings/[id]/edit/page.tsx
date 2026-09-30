import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import EditTourForm from "./EditTourForm";

async function getTour(slug: string) {
  const res = await authFetch(`${BASE_URL}/tour/${slug}`, {
    cache: "no-store",
  });
  if (!res?.ok) return null;
  const data = await res.json();
  if (!data.data) return null;
  // Drop the nested guide/user record: the form doesn't need it and it would
  // otherwise be serialised into the page (it includes private user fields).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { guide, ...tour } = data.data;
  return tour;
}

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const tour = await getTour(slug);

  if (!tour) {
    return <div>Tour not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Tour</h1>
      <EditTourForm tour={tour} />
    </div>
  );
}
