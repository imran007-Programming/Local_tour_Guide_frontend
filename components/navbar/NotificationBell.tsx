"use client";

import { Bell, MessageCircle, X, CheckCheck, ExternalLink } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import { io, Socket } from "socket.io-client";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { useRouter } from "next/navigation";
import useSound from "use-sound";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

let socket: Socket;

export default function NotificationBell() {
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [play] = useSound("/mesenger.mp3", { volume: 1 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "messages">("all");

  const initSocket = async (userId: string) => {
    const { getAccessToken } = await import("@/app/actions/getAccessToken");
    const accessToken = await getAccessToken();

    socket = io(BASE_URL.replace("/api", ""), {
      withCredentials: true,
      auth: { token: accessToken },
    });

    socket.on("connect", () => {
      socket.emit("user-online", userId);
    });

    socket.on("new-message", () => {
      fetchUnreadMessages();
      play();
      setTimeout(() => setIsRinging(true), 100);
      setTimeout(() => setIsRinging(false), 5100);
    });

    socket.on("messages-read", () => {
      fetchUnreadMessages();
    });

    socket.on("new-notification", () => {
      fetchNotifications();
      play();
      setTimeout(() => setIsRinging(true), 100);
      setTimeout(() => setIsRinging(false), 5100);
    });

    socket.on("notification-read", () => {
      fetchNotifications();
    });
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadMessages();

    const initializeWithUser = async () => {
      try {
        const res = await clientAuthFetch(`${BASE_URL}/auth/me`);
        if (res.ok) {
          const data = await res.json();
          const userId = data.data?.id;
          if (userId) {
            initSocket(userId);
          }
        }
      } catch {}
    };

    initializeWithUser();

    return () => {
      socket?.disconnect();
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        const allConversations = data.data || [];
        setConversations(allConversations);
        const totalUnread = allConversations.reduce(
          (sum: number, conv: any) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadMessageCount(totalUnread);

        const unreadConvs = allConversations
          .filter((conv: any) => conv.unreadCount > 0)
          .slice(0, 5);
        setRecentMessages(unreadConvs);
      }
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await clientAuthFetch(`${BASE_URL}/notifications`);
      if (res.ok) {
        const response = await res.json();
        const data = response.data || response;
        const notifArray = Array.isArray(data) ? data : [];
        setNotifications(notifArray.slice(0, 8));
        setUnreadCount(
          notifArray.filter((n: Notification) => !n.isRead).length
        );
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markMessageAsRead = async (conversationId: string) => {
    try {
      await clientAuthFetch(
        `${BASE_URL}/chat/conversations/${conversationId}/read`,
        { method: "PATCH" }
      );
      setRecentMessages((prev) =>
        prev.filter((conv) => conv.id !== conversationId)
      );
      setUnreadMessageCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await clientAuthFetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const totalUnread = unreadCount + unreadMessageCount;

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
      >
        <div className={isRinging ? "animate-ring" : ""}>
          <Bell
            size={20}
            className={
              isRinging
                ? "text-red-500"
                : "text-zinc-600 dark:text-zinc-400"
            }
          />
        </div>
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1 font-bold ring-2 ring-white dark:ring-zinc-900">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile backdrop */}
            <div
              className="fixed inset-0 z-40 sm:hidden bg-black/30"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-full sm:mt-2 w-[calc(100%-24px)] sm:w-[380px] z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                    Notifications
                  </h3>
                  {totalUnread > 0 && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {totalUnread} unread
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 transition px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <CheckCheck size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition sm:hidden"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`flex-1 py-2.5 text-xs font-medium transition ${
                    activeTab === "all"
                      ? "text-red-600 dark:text-red-400 border-b-2 border-red-500"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`flex-1 py-2.5 text-xs font-medium transition ${
                    activeTab === "messages"
                      ? "text-red-600 dark:text-red-400 border-b-2 border-red-500"
                      : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  Messages {unreadMessageCount > 0 && `(${unreadMessageCount})`}
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[360px] overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4 animate-pulse" />
                          <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded w-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeTab === "messages" ? (
                  // Messages Tab
                  recentMessages.length === 0 ? (
                    <div className="py-12 text-center">
                      <MessageCircle
                        size={32}
                        className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2"
                      />
                      <p className="text-sm text-zinc-500">No unread messages</p>
                    </div>
                  ) : (
                    recentMessages.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={async () => {
                          await markMessageAsRead(conv.id);
                          setIsOpen(false);
                          router.push(`/dashboard/chat?convId=${conv.id}`);
                        }}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                      >
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <MessageCircle
                              size={16}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                          </div>
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                              {conv.otherUser?.name || "User"}
                            </p>
                            <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                              {conv.messages?.[0]?.createdAt
                                ? getTimeAgo(conv.messages[0].createdAt)
                                : ""}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                            {conv.messages?.[0]?.content || "New message"}
                          </p>
                        </div>
                        <span className="shrink-0 min-w-[20px] h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {conv.unreadCount}
                        </span>
                      </div>
                    ))
                  )
                ) : // All Notifications Tab
                notifications.length === 0 && recentMessages.length === 0 ? (
                  <div className="py-12 text-center">
                    <Bell
                      size={32}
                      className="mx-auto text-zinc-300 dark:text-zinc-600 mb-2"
                    />
                    <p className="text-sm text-zinc-500">
                      You're all caught up!
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Unread messages preview in All tab */}
                    {recentMessages.length > 0 && (
                      <div
                        onClick={() => setActiveTab("messages")}
                        className="flex items-center gap-3 px-4 py-3 bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition border-b border-zinc-100 dark:border-zinc-800"
                      >
                        <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <MessageCircle
                            size={16}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                            {unreadMessageCount} unread message
                            {unreadMessageCount > 1 ? "s" : ""}
                          </p>
                          <p className="text-xs text-indigo-500 dark:text-indigo-400">
                            Tap to view conversations
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notifications list */}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition border-b border-zinc-100 dark:border-zinc-800 last:border-0 ${
                          !notif.isRead
                            ? "bg-red-50/40 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20"
                            : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center ${
                              !notif.isRead
                                ? "bg-red-100 dark:bg-red-900/30"
                                : "bg-zinc-100 dark:bg-zinc-800"
                            }`}
                          >
                            <Bell
                              size={14}
                              className={
                                !notif.isRead
                                  ? "text-red-500"
                                  : "text-zinc-400"
                              }
                            />
                          </div>
                          {!notif.isRead && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm leading-tight ${
                              !notif.isRead
                                ? "font-medium text-zinc-900 dark:text-white"
                                : "text-zinc-600 dark:text-zinc-400"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            {getTimeAgo(notif.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 p-2">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dashboard/notifications");
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  View all notifications
                  <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
