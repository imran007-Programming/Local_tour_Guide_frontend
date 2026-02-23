"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";
import { X } from "lucide-react";
import Image from "next/image";
import { Tour } from "@/types/tours";

export default function EditTourForm({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    tour.images || [],
  );

  // ✅ Update Tour Info Only
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await authFetch(`${BASE_URL}/tour/${tour.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
      }),
    });

    if (res?.ok) {
      toast.success("Tour updated successfully");

      router.refresh();
      router.push("/dashboard/listings");
    } else {
      toast.error("Failed to update tour");
    }

    setLoading(false);
  };

  // ✅ Upload Images Separately
  const handleUploadImages = async () => {
    if (!photos.length) return;

    setUploading(true);

    const data = new FormData();
    photos.forEach((photo) => data.append("images", photo));

    const res = await authFetch(`${BASE_URL}/tour/${tour.id}/images`, {
      method: "POST",
      body: data,
    });

    if (res?.ok) {
      const result = await res.json();
      toast.success("Images uploaded");
      setPhotos([]);
      setPhotoPreviews([]);
      setExistingImages(result.data.images || []);
      router.refresh();
    } else {
      toast.error("Upload failed");
    }

    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  // ✅ Delete Single Image
  const handleDeleteImage = async (imageUrl: string) => {
    const res = await authFetch(`${BASE_URL}/tour/${tour.id}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    if (res?.ok) {
      const result = await res.json();
      toast.success("Image removed");
      setExistingImages(result.data.images || []);
      router.refresh();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow"
    >
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full p-3 border rounded-lg dark:bg-zinc-800"
        required
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
        className="w-full p-3 border rounded-lg dark:bg-zinc-800 min-h-32"
        required
      />

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="p-3 border rounded-lg dark:bg-zinc-800"
          required
        />
        <input
          type="number"
          placeholder="Duration (hours)"
          value={formData.duration}
          onChange={(e) =>
            setFormData({
              ...formData,
              duration: e.target.value,
            })
          }
          className="p-3 border rounded-lg dark:bg-zinc-800"
          required
        />
      </div>

      {/* Meeting Point */}
      <input
        type="text"
        placeholder="Meeting Point"
        value={formData.meetingPoint}
        onChange={(e) =>
          setFormData({
            ...formData,
            meetingPoint: e.target.value,
          })
        }
        className="w-full p-3 border rounded-lg dark:bg-zinc-800"
        required
      />

      {/* Max Group & City */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          placeholder="Max Group Size"
          value={formData.maxGroupSize}
          onChange={(e) =>
            setFormData({
              ...formData,
              maxGroupSize: e.target.value,
            })
          }
          className="p-3 border rounded-lg dark:bg-zinc-800"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) =>
            setFormData({
              ...formData,
              city: e.target.value,
            })
          }
          className="p-3 border rounded-lg dark:bg-zinc-800"
          required
        />
      </div>

      {/* Itinerary */}
      <textarea
        placeholder="Itinerary"
        value={formData.itinerary}
        onChange={(e) =>
          setFormData({
            ...formData,
            itinerary: e.target.value,
          })
        }
        className="w-full p-3 border rounded-lg dark:bg-zinc-800 min-h-32"
        required
      />

      {/* Category */}
      <input
        type="text"
        placeholder="Category"
        value={formData.category}
        onChange={(e) =>
          setFormData({
            ...formData,
            category: e.target.value,
          })
        }
        className="w-full p-3 border rounded-lg dark:bg-zinc-800"
        required
      />

      {/* Languages */}
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
        className="w-full p-3 border rounded-lg dark:bg-zinc-800"
        required
      />

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block mb-2 font-medium">Existing Images</label>
          <div className="grid grid-cols-4 gap-3">
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <Image
                  width={200}
                  height={200}
                  src={img}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(img)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload New Images */}
      <div>
        <label className="block mb-2 font-medium">Add New Images</label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded-lg dark:bg-zinc-800"
        />

        {photoPreviews.length > 0 && (
          <div className="mt-3">
            <div className="grid grid-cols-4 gap-3 mb-3">
              {photoPreviews.map((preview, i) => (
                <div key={i} className="relative">
                  <Image
                    width={200}
                    height={200}
                    src={preview}
                    alt=""
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotos(photos.filter((_, idx) => idx !== i));
                      setPhotoPreviews(
                        photoPreviews.filter((_, idx) => idx !== i),
                      );
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleUploadImages}
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
