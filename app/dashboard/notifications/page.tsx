"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageCircle,
  Filter,
  Inbox,
} from "lucide-react";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type MessageNotification = {
  id: string;
  unreadCount: number;
  otherUser: {
    name: string;
    profilePic?: string;
  };
  messages: Array<{
    content?: string;
    createdAt?: string;
  }>;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [messageNotifications, setMessageNotifications] = useState<
    MessageNotification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessageNotifications = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        const conversations = data.data || [];
        const unreadConvs = conversations.filter(
          (conv: MessageNotification) => conv.unreadCount > 0
        );
        setMessageNotifications(unreadConvs);
      } else {
        setMessageNotifications([]);
      }
    } catch {
      setMessageNotifications([]);
    }
  };

  const fetchNotifications = async () => {
    try {
      const adminRes = await clientAuthFetch(`${BASE_URL}/admin/notifications`);
      if (adminRes.ok) {
        const adminResponse = await adminRes.json();
        const adminData = adminResponse.data || adminResponse;
        if (Array.isArray(adminData) && adminData.length > 0) {
          setNotifications(adminData);
          return;
        }
      }

      const res = await clientAuthFetch(`${BASE_URL}/notifications`);
      if (res.ok) {
        const response = await res.json();
        const data = response.data || response;
        setNotifications(Array.isArray(data) ? data : []);
      } else {
        setNotifications([]);
      }
    } catch {
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
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/${id}`, {
        method: "DELETE",
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notification deleted");
    } catch {}
  };

  const deleteAllNotifications = async () => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/delete-all`, {
        method: "DELETE",
      });
      setNotifications([]);
      toast.success("All notifications deleted");
    } catch {
      toast.error("Failed to delete notifications");
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return then.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={deleteAllNotifications}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition"
            >
              <Trash2 size={16} />
              Delete all
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-0">
        {[
          { id: "all" as const, label: "All", count: notifications.length },
          { id: "unread" as const, label: "Unread", count: unreadCount },
          { id: "read" as const, label: "Read", count: notifications.length - unreadCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`relative px-4 py-2.5 text-sm font-medium transition-all ${
              filter === tab.id
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`ml-1.5 text-xs ${
                filter === tab.id
                  ? "text-red-500 dark:text-red-400"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}>
                {tab.count}
              </span>
            )}
            {filter === tab.id && (
              <motion.div
                layoutId="notif-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 animate-pulse" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full animate-pulse" />
                <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Unread Messages Section */}
          {messageNotifications.length > 0 && filter !== "read" && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-indigo-50/50 dark:bg-indigo-900/10">
                <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <MessageCircle size={16} />
                  Unread Messages ({messageNotifications.length})
                </h3>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {messageNotifications.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/dashboard/chat?convId=${conv.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                      <MessageCircle
                        size={18}
                        className="text-indigo-600 dark:text-indigo-400"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {conv.otherUser.name}
                        </p>
                        <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full font-bold">
                          {conv.unreadCount}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        {conv.messages[0]?.content || "New message"}
                      </p>
                    </div>
                    <span className="text-[11px] text-zinc-400 shrink-0">
                      {conv.messages[0]?.createdAt
                        ? getTimeAgo(conv.messages[0].createdAt)
                        : "Now"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Notifications List */}
          {filtered.length === 0 && messageNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                <Inbox size={28} className="text-zinc-400" />
              </div>
              <h3 className="text-base font-medium text-zinc-900 dark:text-white">
                No notifications
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {filter === "unread"
                  ? "You've read all your notifications"
                  : "When something happens, you'll see it here"}
              </p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              <AnimatePresence>
                {filtered.map((notif, index) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors ${
                      !notif.isRead
                        ? "bg-red-50/40 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {/* Icon */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          !notif.isRead
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <Bell
                          size={16}
                          className={
                            !notif.isRead
                              ? "text-red-500"
                              : "text-zinc-400"
                          }
                        />
                      </div>
                      {!notif.isRead && (
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          !notif.isRead
                            ? "font-semibold text-zinc-900 dark:text-zinc-100"
                            : "font-medium text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-1.5">
                        {getTimeAgo(notif.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-emerald-500 transition"
                          title="Mark as read"
                        >
                          <Check size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-400 hover:text-red-500 transition"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
