"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import { Bell, Check, Trash2 } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        credentials: "include",
      });
      if (res.ok) {
        const response = await res.json();
        const data = response.data || response;
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`${BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const filtered = Array.isArray(notifications)
    ? notifications.filter((n) => (filter === "unread" ? !n.isRead : true))
    : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell size={28} />
          Notifications
        </h1>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <Check size={16} />
          Mark all as read
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded ${
            filter === "unread"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Unread
        </button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-lg border flex justify-between items-start ${
                !notif.isRead
                  ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{notif.title}</h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notif.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
