"use client";

import { useState, FormEvent } from "react";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import Image from "next/image";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user?.data?.name || "");
  const [bio, setBio] = useState(user?.data?.bio || "");
  const [languages, setLanguages] = useState(
    user?.data?.languages?.join(", ") || "",
  );
  const [profilePic, setProfilePic] = useState<File | string>(
    user?.data?.profilePic || "",
  );
  const [preview, setPreview] = useState(user?.data?.profilePic || "");
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState(
    user?.data?.tourist?.preferences?.join(", ") || "",
  );

  const [expertise, setExpertise] = useState(
    user?.data?.guide?.expertise?.join(", ") || "",
  );

  const [dailyRate, setDailyRate] = useState(
    user?.data?.guide?.dailyRate || "",
  );
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);

      formData.append(
        "languages",
        JSON.stringify(languages.split(",").map((l) => l.trim())),
      );

      if (profilePic instanceof File) {
        formData.append("profilePic", profilePic);
      }

      await authFetch(`${BASE_URL}/users/update-profile`, {
        method: "PATCH",
        body: formData,
        // credentials: "include",
      });

      //  Role specific update
      if (user?.data?.role === "TOURIST") {
        await authFetch(`${BASE_URL}/tourists`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          // credentials: "include",
          body: JSON.stringify({
            preferences: preferences.split(",").map((p) => p.trim()),
          }),
        });
      }

      if (user?.data?.role === "GUIDE") {
        await authFetch(`${BASE_URL}/guides`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            expertise: expertise.split(",").map((e) => e.trim()),
            dailyRate: Number(dailyRate),
          }),
        });
      }

      router.refresh();
      toast.success("Profile updated successfully 🎉");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="w-full max-w-6xl mx-auto bg-white dark:bg-[#0B0F19]
               border border-zinc-200 dark:border-zinc-800
               rounded-2xl p-8 shadow-xl space-y-10"
    >
      {/* Top Tabs */}
      <div className="flex gap-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          type="button"
          className="text-red-600 font-semibold border-b-2 border-red-600 pb-2"
        >
          Profile Settings
        </button>
      </div>

      {/* Basic Info Title */}
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Basic Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Image */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Image
            width={160}
            height={160}
            src={preview || "/avatar.png"}
            alt="Profile picture"
            className="w-40 h-40 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700"
          />

          <p className="text-xs text-zinc-500">Recommended size 400 x 400 px</p>

          <div className="flex gap-3">
            <label className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition">
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setPreview("");
                setProfilePic("");
              }}
              className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-white px-4 py-2 rounded-xl text-sm transition"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="md:col-span-3 space-y-6">
          {/* Name & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border border-zinc-300
                         dark:border-zinc-700 rounded-xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Languages
              </label>
              <input
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                className="w-full bg-transparent border border-zinc-300
                         dark:border-zinc-700 rounded-xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-2 text-sm font-medium">Bio</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-transparent border border-zinc-300
                       dark:border-zinc-700 rounded-xl px-4 py-3
                       focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Role Specific Fields */}
          {user?.data?.role === "TOURIST" && (
            <div>
              <label className="block mb-2 text-sm font-medium">
                Preferences
              </label>
              <input
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="w-full bg-transparent border border-zinc-300
                         dark:border-zinc-700 rounded-xl px-4 py-3
                         focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {user?.data?.role === "GUIDE" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Expertise
                </label>
                <input
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="w-full bg-transparent border border-zinc-300
                           dark:border-zinc-700 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Daily Rate
                </label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                  className="w-full bg-transparent border border-zinc-300
                           dark:border-zinc-700 rounded-xl px-4 py-3
                           focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-white px-6 py-3 rounded-xl transition"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl transition duration-200 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
