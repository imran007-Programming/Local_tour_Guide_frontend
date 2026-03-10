"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BASE_URL } from "@/lib/config";
import { authFetch } from "@/lib/authFetch";

export default function CreateTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [maxGroupSize, setMaxGroupSize] = useState("");
  const [city, setCity] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [category, setCategory] = useState("");
  const [languages, setLanguages] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos([...photos, ...files]);
    setPreviews([
      ...previews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const fillDummyData = () => {
    setTitle("Historic Paris Walking Tour");
    setDescription(
      "Explore the iconic landmarks of Paris including the Eiffel Tower, Louvre Museum, and Notre-Dame Cathedral. Experience the rich history and culture of the City of Light.",
    );
    setPrice("150");
    setDuration("4");
    setMeetingPoint("Eiffel Tower Main Entrance");
    setMaxGroupSize("15");
    setCity("Paris");
    setItinerary(
      "9:00 AM - Meet at Eiffel Tower\n10:30 AM - Visit Louvre Museum\n12:00 PM - Lunch break\n1:30 PM - Notre-Dame Cathedral\n3:00 PM - Tour ends",
    );
    setCategory("Cultural");
    setLanguages("English, French, Spanish");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("duration", duration);
    formData.append("meetingPoint", meetingPoint);
    formData.append("maxGroupSize", maxGroupSize);
    formData.append("city", city);
    formData.append("itinerary", itinerary);
    formData.append("category", category);
    
    const languagesArray = languages.split(",").map((lang) => lang.trim());
    languagesArray.forEach((lang) => formData.append("languages", lang));
    
    photos.forEach((photo) => formData.append("images", photo));

    try {
      await authFetch(`${BASE_URL}/tour/create-tour`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      router.push("/dashboard/listings");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Create New Tour</h2>
        <button
          type="button"
          onClick={fillDummyData}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          Fill Dummy Data
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-zinc-900 p-8 rounded-xl shadow"
      >
        <div>
          <label className="block mb-2 font-medium">Tour Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800 h-32"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Price ($)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Duration (hours)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Meeting Point</label>
            <input
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Max Group Size</label>
            <input
              type="number"
              value={maxGroupSize}
              onChange={(e) => setMaxGroupSize(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Languages (comma separated)
          </label>
          <input
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Itinerary</label>
          <textarea
            value={itinerary}
            onChange={(e) => setItinerary(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800 h-32"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border px-4 py-2 rounded-lg dark:bg-zinc-800"
          />
          <div className="grid grid-cols-4 gap-4 mt-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  width={200}
                  height={200}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Tour"}
        </button>
      </form>
    </div>
  );
}
