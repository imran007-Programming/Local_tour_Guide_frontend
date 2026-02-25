"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Bell, Globe, CreditCard, Shield } from "lucide-react";

export default function SettingsContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("account");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const tabs = [
    { id: "account", label: "Account", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "preferences", label: "Preferences", icon: Globe },
    ...(user.data.role === "GUIDE" ? [{ id: "payment", label: "Payment", icon: CreditCard }] : []),
  ];

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Password updated successfully");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="current">Current Password</Label>
                    <Input id="current" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new">New Password</Label>
                    <Input id="new" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <Input id="confirm" type="password" className="mt-1" />
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-white">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive booking updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium dark:text-white">Push Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive real-time alerts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="h-5 w-5"
                  />
                </div>
              </div>
              <Button onClick={() => toast.success("Preferences saved")}>Save Changes</Button>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="p-4 border dark:border-gray-700 rounded-lg">
                  <p className="font-medium dark:text-white">Profile Visibility</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Control who can see your profile</p>
                  <select className="mt-2 w-full p-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded">
                    <option>Public</option>
                    <option>Private</option>
                  </select>
                </div>
                <div className="p-4 border border-red-200 dark:border-red-900 rounded-lg">
                  <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Permanently delete your account and data</p>
                  <Button variant="destructive" className="mt-2">Delete Account</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <Label>Language</Label>
                  <select className="mt-1 w-full p-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <Label>Timezone</Label>
                  <select className="mt-1 w-full p-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                  </select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <select className="mt-1 w-full p-2 border dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
              </div>
              <Button onClick={() => toast.success("Preferences saved")}>Save Changes</Button>
            </div>
          )}

          {activeTab === "payment" && user.data.role === "GUIDE" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold dark:text-white">Payment Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label>Bank Account</Label>
                  <Input placeholder="Account Number" className="mt-1" />
                </div>
                <div>
                  <Label>Routing Number</Label>
                  <Input placeholder="Routing Number" className="mt-1" />
                </div>
                <div>
                  <Label>Tax ID</Label>
                  <Input placeholder="Tax Identification Number" className="mt-1" />
                </div>
              </div>
              <Button onClick={() => toast.success("Payment info saved")}>Save Changes</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
