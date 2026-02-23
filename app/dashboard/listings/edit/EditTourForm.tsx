"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function EditTourForm({ tour }: { tour: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: tour.title || "",
    description: tour.description || "",
    price: tour.price || "",
    duration: tour.duration || "",
    meetingPoint: tour.meetingPoint || "",
    maxGroupSize: tour.maxGroupSize || "",
    city: tour.city || "",
    itinerary: tour.itinerary || "",
    category: tour.category || "",
    languages: tour.languages || [],
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(tour.images || []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("duration", formData.duration);
    data.append("meetingPoint", formData.meetingPoint);
    data.append("maxGroupSize", formData.maxGroupSize);
    data.append("city", formData.city);
    data.append("itinerary", formData.itinerary);
    data.append("category", formData.category);
    formData.languages.forEach((lang) => data.append("languages", lang));
    photos.forEach((photo) => data.append("images", photo));
    data.append("existingImages", JSON.stringify(existingImages));

    const res = await authFetch(`${BASE_URL}/tour/${tour._id}`, {
      method: "PUT",
      body: data,
    });

    if (res?.ok) {
      toast.success("Tour updated successfully");
      router.push(`/dashboard/listings/${tour._id}`);
      router.refresh();
    } else {
      toast.error("Failed to update tour");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-900"
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-900 min-h-32"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="p-3 border rounded-lg dark:bg-zinc-900"
          required
        />
        <input
          type="number"
          placeholder="Duration (hours)"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="p-3 border rounded-lg dark:bg-zinc-900"
          required
        />
      </div>
      <input
        type="text"
        placeholder="Meeting Point"
        value={formData.meetingPoint}
        onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-900"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Max Group Size"
          value={formData.maxGroupSize}
          onChange={(e) => setFormData({ ...formData, maxGroupSize: e.target.value })}
          className="p-3 border rounded-lg dark:bg-zinc-900"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="p-3 border rounded-lg dark:bg-zinc-900"
          required
        />
      </div>
      <textarea
        placeholder="Itinerary"
        value={formData.itinerary}
        onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-900 min-h-32"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-900"
        required
      />
      <input
        type="text"
        placeholder="Languages (comma separated)"
        value={formData.languages.join(", ")}
        onChange={(e) =>
          setFormData({
            ...formData,
            languages: e.target.value.split(",").map((l) => l.trim()),
          })
        }
        className="w-full p-3 border rounded-lg dark:bg-zinc-900"
        required
      />

      {existingImages.length > 0 && (
        <div>
          <label className="block mb-2 font-medium">Existing Images</label>
          <div className="grid grid-cols-4 gap-2">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img src={img} alt="" className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium">Add New Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
          className="w-full p-3 border rounded-lg dark:bg-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
