"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import Link from "next/link";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications`, {
        credentials: "include",
      });
      if (res.ok) {
        const response = await res.json();
        const data = response.data || response;
        const notifArray = Array.isArray(data) ? data : [];
        setNotifications(notifArray.slice(0, 5));
        setUnreadCount(notifArray.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-semibold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications</p>
            ) : (
              <div>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                      !notif.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <p className="font-medium text-sm">{notif.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                <Link
                  href="/dashboard/notifications"
                  className="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  View All
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
