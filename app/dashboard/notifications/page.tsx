"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import { Bell, Check, Trash2, MessageCircle } from "lucide-react";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import Link from "next/link";

type MessageNotification = {
  id: string;
  unreadCount: number;
  otherUser: {
    name: string;
  };
  messages: Array<{
    content?: string;
    createdAt?: string;
  }>;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [messageNotifications, setMessageNotifications] = useState<MessageNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessageNotifications = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        const conversations = data.data || [];
        const unreadConvs = conversations.filter((conv: MessageNotification) => conv.unreadCount > 0);
        setMessageNotifications(unreadConvs);
      } else {
        console.error("Failed to fetch message notifications: Status", res.status);
        setMessageNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch message notifications:", error);
      setMessageNotifications([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/notifications`);
      console.log("Notifications API Response Status:", res.status);
      
      if (res.ok) {
        const response = await res.json();
        console.log("Notifications API Response:", response);
        const data = response.data || response;
        setNotifications(Array.isArray(data) ? data : []);
      } else {
        const errorText = await res.text();
        console.error("Failed to fetch notifications:", {
          status: res.status,
          statusText: res.statusText,
          error: errorText
        });
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchNotifications();
      await fetchMessageNotifications();
      setIsLoading(false);
    };
    void loadData();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
      });
      void fetchNotifications();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
      });
      void fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/${id}`, {
        method: "DELETE",
      });
      void fetchNotifications();
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
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-gray-100 dark:bg-gray-800 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {messageNotifications.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle size={20} />
                  Unread Messages
                </h2>
                {messageNotifications.map((conv) => (
                  <Link
                    key={conv.id}
                    href="/dashboard/chat"
                    className="block p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-3 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{conv.otherUser.name}</h3>
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                            {conv.unreadCount} new
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {conv.messages[0]?.content?.substring(0, 100) || 'New message'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {conv.messages[0]?.createdAt ? new Date(conv.messages[0].createdAt).toLocaleString() : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {filtered.length === 0 && messageNotifications.length === 0 ? (
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
          </>
        )}
      </div>
    </div>
  );
}