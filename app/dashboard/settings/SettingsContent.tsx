"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { toast } from "sonner";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { logoutAction } from "@/app/actions/logoutAction";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  Globe,
  Shield,
  Palette,
  Trash2,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  MessageSquare,
  Calendar,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  DollarSign,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsContent({ user }: { user: User }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Active section
  const [activeSection, setActiveSection] = useState("appearance");

  // Notification preferences (stored in localStorage for now)
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailMessages: true,
    emailPromotions: false,
    pushBookings: true,
    pushMessages: true,
    pushReminders: true,
    soundEnabled: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
  });

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Save notifications
  const handleSaveNotifications = () => {
    localStorage.setItem("notificationPrefs", JSON.stringify(notifications));
    toast.success("Notification preferences saved");
  };

  // Save privacy
  const handleSavePrivacy = () => {
    localStorage.setItem("privacyPrefs", JSON.stringify(privacy));
    toast.success("Privacy settings saved");
  };

  // Save preferences
  const handleSavePreferences = () => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    toast.success("Preferences saved");
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await authFetch(`${BASE_URL}/users/delete-account`, {
        method: "DELETE",
      });

      if (res?.ok) {
        toast.success("Account deleted successfully");
        await logoutAction();
      } else {
        toast.error("Failed to delete account");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteLoading(false);
    }
  };

  const sections = [
    { id: "appearance", label: "Appearance", icon: Palette, description: "Theme & display" },
    { id: "notifications", label: "Notifications", icon: Bell, description: "Alerts & sounds" },
    { id: "privacy", label: "Privacy", icon: Shield, description: "Visibility & data" },
    { id: "preferences", label: "Preferences", icon: Globe, description: "Language & currency" },
    { id: "danger", label: "Danger Zone", icon: Trash2, description: "Delete account" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar Navigation */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 h-fit">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
              activeSection === section.id
                ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            }`}
          >
            <section.icon
              size={18}
              className={
                activeSection === section.id
                  ? "text-red-500"
                  : section.id === "danger"
                    ? "text-red-400"
                    : "text-zinc-400"
              }
            />
            <div>
              <p className="text-sm font-medium">{section.label}</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {section.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* ===== APPEARANCE ===== */}
        {activeSection === "appearance" && (
          <SettingsCard key="appearance" title="Appearance" subtitle="Customize how TourGuide looks on your device">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3 block">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "light", label: "Light", icon: Sun },
                    { value: "dark", label: "Dark", icon: Moon },
                    { value: "system", label: "System", icon: Monitor },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        theme === option.value
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <option.icon
                        size={24}
                        className={
                          theme === option.value
                            ? "text-red-500"
                            : "text-zinc-400"
                        }
                      />
                      <span className="text-xs font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingsCard>
        )}

        {/* ===== NOTIFICATIONS ===== */}
        {activeSection === "notifications" && (
          <SettingsCard key="notifications" title="Notifications" subtitle="Choose what alerts you want to receive">
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Mail size={16} className="text-zinc-400" />
                  Email Notifications
                </h4>
                <div className="space-y-2">
                  <ToggleRow
                    label="Booking updates"
                    description="Get notified when a booking is confirmed or changed"
                    checked={notifications.emailBookings}
                    onChange={(v) => setNotifications({ ...notifications, emailBookings: v })}
                  />
                  <ToggleRow
                    label="New messages"
                    description="Email alerts for new chat messages"
                    checked={notifications.emailMessages}
                    onChange={(v) => setNotifications({ ...notifications, emailMessages: v })}
                  />
                  <ToggleRow
                    label="Promotions & tips"
                    description="Travel tips and special offers"
                    checked={notifications.emailPromotions}
                    onChange={(v) => setNotifications({ ...notifications, emailPromotions: v })}
                  />
                </div>
              </div>

              <hr className="border-zinc-200 dark:border-zinc-800" />

              {/* Push Notifications */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  <Smartphone size={16} className="text-zinc-400" />
                  Push Notifications
                </h4>
                <div className="space-y-2">
                  <ToggleRow
                    label="Booking alerts"
                    description="Real-time booking status changes"
                    checked={notifications.pushBookings}
                    onChange={(v) => setNotifications({ ...notifications, pushBookings: v })}
                  />
                  <ToggleRow
                    label="Chat messages"
                    description="Instant message notifications"
                    checked={notifications.pushMessages}
                    onChange={(v) => setNotifications({ ...notifications, pushMessages: v })}
                  />
                  <ToggleRow
                    label="Tour reminders"
                    description="Reminders before your upcoming tours"
                    checked={notifications.pushReminders}
                    onChange={(v) => setNotifications({ ...notifications, pushReminders: v })}
                  />
                </div>
              </div>

              <hr className="border-zinc-200 dark:border-zinc-800" />

              {/* Sound */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
                  {notifications.soundEnabled ? <Volume2 size={16} className="text-zinc-400" /> : <VolumeX size={16} className="text-zinc-400" />}
                  Sound
                </h4>
                <ToggleRow
                  label="Notification sound"
                  description="Play a sound when you receive notifications"
                  checked={notifications.soundEnabled}
                  onChange={(v) => setNotifications({ ...notifications, soundEnabled: v })}
                />
              </div>

              <button
                onClick={handleSaveNotifications}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
              >
                Save Preferences
              </button>
            </div>
          </SettingsCard>
        )}

        {/* ===== PRIVACY ===== */}
        {activeSection === "privacy" && (
          <SettingsCard key="privacy" title="Privacy" subtitle="Control your profile visibility and data">
            <div className="space-y-6">
              {/* Profile Visibility */}
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
                  Profile Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "public", label: "Public", desc: "Anyone can view your profile", icon: Eye },
                    { value: "private", label: "Private", desc: "Only you can see your profile", icon: EyeOff },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPrivacy({ ...privacy, profileVisibility: option.value })}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        privacy.profileVisibility === option.value
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300"
                      }`}
                    >
                      <option.icon size={20} className={privacy.profileVisibility === option.value ? "text-red-500" : "text-zinc-400"} />
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{option.label}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{option.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-zinc-200 dark:border-zinc-800" />

              {/* Contact info visibility */}
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <ToggleRow
                    label="Show email address"
                    description="Allow other users to see your email"
                    checked={privacy.showEmail}
                    onChange={(v) => setPrivacy({ ...privacy, showEmail: v })}
                  />
                  <ToggleRow
                    label="Show phone number"
                    description="Allow other users to see your phone"
                    checked={privacy.showPhone}
                    onChange={(v) => setPrivacy({ ...privacy, showPhone: v })}
                  />
                </div>
              </div>

              <button
                onClick={handleSavePrivacy}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
              >
                Save Privacy Settings
              </button>
            </div>
          </SettingsCard>
        )}

        {/* ===== PREFERENCES ===== */}
        {activeSection === "preferences" && (
          <SettingsCard key="preferences" title="Preferences" subtitle="Set your language, currency and date format">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectField
                  label="Language"
                  value={preferences.language}
                  onChange={(v) => setPreferences({ ...preferences, language: v })}
                  options={[
                    { value: "en", label: "English" },
                    { value: "es", label: "Español" },
                    { value: "fr", label: "Français" },
                    { value: "de", label: "Deutsch" },
                    { value: "ar", label: "العربية" },
                    { value: "hi", label: "हिन्दी" },
                  ]}
                />
                <SelectField
                  label="Currency"
                  value={preferences.currency}
                  onChange={(v) => setPreferences({ ...preferences, currency: v })}
                  options={[
                    { value: "USD", label: "USD ($)" },
                    { value: "EUR", label: "EUR (€)" },
                    { value: "GBP", label: "GBP (£)" },
                    { value: "BDT", label: "BDT (৳)" },
                    { value: "INR", label: "INR (₹)" },
                    { value: "AUD", label: "AUD (A$)" },
                  ]}
                />
                <SelectField
                  label="Date Format"
                  value={preferences.dateFormat}
                  onChange={(v) => setPreferences({ ...preferences, dateFormat: v })}
                  options={[
                    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                  ]}
                />
              </div>

              <button
                onClick={handleSavePreferences}
                className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
              >
                Save Preferences
              </button>
            </div>
          </SettingsCard>
        )}

        {/* ===== DANGER ZONE ===== */}
        {activeSection === "danger" && (
          <SettingsCard key="danger" title="Danger Zone" subtitle="Irreversible actions on your account">
            <div className="space-y-6">
              <div className="p-5 border-2 border-red-200 dark:border-red-900/50 rounded-xl bg-red-50/50 dark:bg-red-900/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Delete Account
                    </h4>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                      Once you delete your account, there is no going back. All your data,
                      bookings, reviews, and messages will be permanently removed.
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-red-700 dark:text-red-400 mb-1.5 block">
                      Type "DELETE" to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder="DELETE"
                      className="w-full max-w-xs bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 placeholder:text-zinc-400"
                    />
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "DELETE" || deleteLoading}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                    {deleteLoading ? "Deleting..." : "Delete My Account"}
                  </button>
                </div>
              </div>
            </div>
          </SettingsCard>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== Settings Card Wrapper ===== */
function SettingsCard({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          {subtitle}
        </p>
      </div>
      {children}
    </motion.div>
  );
}

/* ===== Toggle Row ===== */
function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-red-500" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

/* ===== Select Field ===== */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block mb-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 transition appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
