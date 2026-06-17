"use client";

import { useState, FormEvent } from "react";
import { BASE_URL } from "@/lib/config";
import { useRouter } from "next/navigation";
import { User } from "@/types/user";
import Image from "next/image";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import {
  Eye,
  EyeOff,
  Camera,
  Loader2,
  User as UserIcon,
  Lock,
  Globe,
  Briefcase,
  Heart,
  Shield,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter();

  // Profile fields
  const [name, setName] = useState(user?.data?.name || "");
  const [bio, setBio] = useState(user?.data?.bio || "");
  const [languages, setLanguages] = useState(
    user?.data?.languages?.join(", ") || ""
  );
  const [profilePic, setProfilePic] = useState<File | string>(
    user?.data?.profilePic || ""
  );
  const [preview, setPreview] = useState(user?.data?.profilePic || "");
  const [loading, setLoading] = useState(false);

  // Tourist fields
  const [preferences, setPreferences] = useState(
    user?.data?.tourist?.preferences?.join(", ") || ""
  );

  // Guide fields
  const [expertise, setExpertise] = useState(
    user?.data?.guide?.expertise?.join(", ") || ""
  );
  const [dailyRate, setDailyRate] = useState(
    user?.data?.guide?.dailyRate || ""
  );

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Active section
  const [activeSection, setActiveSection] = useState<"profile" | "password">(
    "profile"
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      formData.append(
        "languages",
        JSON.stringify(
          languages
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean)
        )
      );

      if (profilePic instanceof File) {
        formData.append("profilePic", profilePic);
      }

      const profileRes = await authFetch(`${BASE_URL}/users/update-profile`, {
        method: "PATCH",
        body: formData,
      });

      if (!profileRes?.ok) {
        const err = await profileRes?.json();
        throw new Error(err?.message || "Failed to update profile");
      }

      if (user?.data?.role === "TOURIST" && preferences.trim()) {
        const touristRes = await authFetch(`${BASE_URL}/tourists`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            preferences: preferences
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean),
          }),
        });
        if (!touristRes?.ok) {
          const err = await touristRes?.json();
          throw new Error(err?.message || "Failed to update preferences");
        }
      }

      if (user?.data?.role === "GUIDE") {
        const guideRes = await authFetch(`${BASE_URL}/guides`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expertise: expertise
              .split(",")
              .map((e) => e.trim())
              .filter(Boolean),
            dailyRate: Number(dailyRate),
          }),
        });
        if (!guideRes?.ok) {
          const err = await guideRes?.json();
          throw new Error(err?.message || "Failed to update guide info");
        }
      }

      router.refresh();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await authFetch(`${BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res?.json();

      if (!res?.ok) {
        throw new Error(data?.message || "Failed to change password");
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const sidebarItems = [
    {
      id: "profile" as const,
      label: "Edit Profile",
      icon: UserIcon,
      description: "Update your personal info",
    },
    {
      id: "password" as const,
      label: "Security",
      icon: Lock,
      description: "Change your password",
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ===== SIDEBAR ===== */}
        <div className="space-y-3">
          {/* User Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 text-center">
            <div className="relative w-20 h-20 mx-auto mb-3">
              <Image
                width={80}
                height={80}
                src={preview || "/avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover ring-4 ring-red-100 dark:ring-red-900/30"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-zinc-900" />
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">
              {user?.data?.name}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {user?.data?.email}
            </p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
              {user?.data?.role}
            </span>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    activeSection === item.id
                      ? "text-red-500"
                      : "text-zinc-400"
                  }
                />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ===== MAIN CONTENT ===== */}
        <AnimatePresence mode="wait">
          {activeSection === "profile" && (
            <motion.form
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleUpdate}
              className="space-y-6"
            >
              {/* Profile Photo Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                  <Camera size={20} className="text-red-500" />
                  Profile Photo
                </h3>
                <div className="flex items-center gap-5">
                  <div className="relative group shrink-0">
                    <Image
                      width={96}
                      height={96}
                      src={preview || "/avatar.png"}
                      alt="Profile picture"
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-zinc-100 dark:border-zinc-800"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer backdrop-blur-[2px]">
                      <Camera className="text-white" size={22} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Upload a new photo. Recommended size is 400×400px.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <label className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer transition">
                        Choose File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {preview && (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const res = await authFetch(`${BASE_URL}/users/remove-profile-pic`, {
                                method: "DELETE",
                              });
                              if (res?.ok) {
                                setPreview("");
                                setProfilePic("");
                                router.refresh();
                                toast.success("Profile picture removed");
                              } else {
                                const err = await res?.json();
                                toast.error(err?.message || "Failed to remove picture");
                              }
                            } catch {
                              toast.error("Failed to remove picture");
                            }
                          }}
                          className="px-4 py-2 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info Card */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                  <UserIcon size={20} className="text-red-500" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name"
                    value={name}
                    onChange={setName}
                    placeholder="Your full name"
                  />
                  <InputField
                    label="Email"
                    value={user?.data?.email || ""}
                    onChange={() => {}}
                    disabled
                  />
                  <div className="md:col-span-2">
                    <InputField
                      label="Languages"
                      value={languages}
                      onChange={setLanguages}
                      placeholder="English, Spanish, French"
                      icon={<Globe size={16} className="text-zinc-400" />}
                      hint="Separate multiple languages with commas"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the world about yourself..."
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition resize-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Tourist Preferences */}
              {user?.data?.role === "TOURIST" && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                    <Heart size={20} className="text-red-500" />
                    Travel Preferences
                  </h3>
                  <InputField
                    label="Interests"
                    value={preferences}
                    onChange={setPreferences}
                    placeholder="Adventure, Culture, Food, Nature, Photography"
                    hint="Helps guides personalize your experience"
                  />
                </div>
              )}

              {/* Guide Info */}
              {user?.data?.role === "GUIDE" && (
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
                    <Briefcase size={20} className="text-red-500" />
                    Guide Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputField
                      label="Areas of Expertise"
                      value={expertise}
                      onChange={setExpertise}
                      placeholder="History, Architecture, Food Tours"
                      hint="Comma separated"
                    />
                    <InputField
                      label="Daily Rate ($)"
                      value={String(dailyRate)}
                      onChange={setDailyRate}
                      placeholder="150"
                      type="number"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.form>
          )}

          {activeSection === "password" && (
            <motion.form
              key="password"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onSubmit={handlePasswordChange}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Shield size={20} className="text-red-500" />
                    Change Password
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Keep your account secure with a strong password
                  </p>
                </div>

                <div className="max-w-lg space-y-5">
                  {/* Current Password */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition placeholder:text-zinc-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {/* Strength indicator */}
                    {newPassword && (
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              newPassword.length >= level * 3
                                ? level <= 2
                                  ? "bg-red-400"
                                  : level === 3
                                    ? "bg-yellow-400"
                                    : "bg-green-400"
                                : "bg-zinc-200 dark:bg-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      required
                      minLength={6}
                      className={`w-full bg-zinc-50 dark:bg-zinc-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition placeholder:text-zinc-400 ${
                        confirmPassword && confirmPassword !== newPassword
                          ? "border-red-400 ring-1 ring-red-400/30"
                          : confirmPassword && confirmPassword === newPassword
                            ? "border-green-400 ring-1 ring-green-400/30"
                            : "border-zinc-200 dark:border-zinc-700"
                      }`}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                        Passwords do not match
                      </p>
                    )}
                    {confirmPassword && confirmPassword === newPassword && (
                      <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                        <Check size={12} /> Passwords match
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-8 pt-5 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="submit"
                    disabled={
                      passwordLoading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      newPassword !== confirmPassword
                    }
                    className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-500 rounded-xl hover:from-red-700 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center gap-2"
                  >
                    {passwordLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Lock size={16} />
                    )}
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ===== Reusable Input Field ===== */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
  icon,
  hint,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  icon?: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition placeholder:text-zinc-400 ${
            icon ? "pl-9" : ""
          } ${disabled ? "opacity-60 cursor-not-allowed bg-zinc-100 dark:bg-zinc-900" : ""}`}
        />
      </div>
      {hint && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}
