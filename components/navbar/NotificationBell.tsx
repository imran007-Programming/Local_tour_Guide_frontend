"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { Notification } from "@/types/notification";
import { BASE_URL } from "@/lib/config";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { useRouter } from "next/navigation";

let socket: Socket;

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadMessages();
    
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadMessages();
    }, 30000);
    
    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    socket = io(BASE_URL.replace('/api', ''), {
      withCredentials: true,
      auth: { token: accessToken }
    });

    socket.on("new-message", () => {
      fetchUnreadMessages();
    });

    socket.on("messages-read", () => {
      fetchUnreadMessages();
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      if (res.ok) {
        const data = await res.json();
        const allConversations = data.data || [];
        setConversations(allConversations);
        const totalUnread = allConversations.reduce((sum: number, conv: any) => sum + (conv.unreadCount || 0), 0);
        setUnreadMessageCount(totalUnread);
        
        const unreadConvs = allConversations
          .filter((conv: any) => conv.unreadCount > 0)
          .slice(0, 3);
        setRecentMessages(unreadConvs);
      }
    } catch (error) {}
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  const markMessageAsRead = async (conversationId: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/chat/conversations/${conversationId}/read`, {
        method: "PATCH",
      });
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      ));
      setRecentMessages(prev => prev.filter(conv => conv.id !== conversationId));
      setUnreadMessageCount(prev => {
        const conv = recentMessages.find(c => c.id === conversationId);
        return Math.max(0, prev - (conv?.unreadCount || 0));
      });
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read
      await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        credentials: "include",
      });
      
      // Mark all messages as read
      for (const conv of recentMessages) {
        await markMessageAsRead(conv.id);
      }
      
      fetchNotifications();
      fetchUnreadMessages();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
      >
        <Bell size={20} />
        {(unreadCount + unreadMessageCount) > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-semibold">
            {(unreadCount + unreadMessageCount) > 99 ? '99+' : (unreadCount + unreadMessageCount)}
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
            {isLoading ? (
              <div className="space-y-3 p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 && recentMessages.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No notifications</p>
            ) : (
              <div>
                {recentMessages.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={async () => {
                      await markMessageAsRead(conv.id);
                      setIsOpen(false);
                      router.push(`/dashboard/chat?convId=${conv.id}`);
                    }}
                    className="block p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 bg-blue-50 dark:bg-blue-900/20 cursor-pointer"
                  >
                    <p className="font-medium text-sm flex items-center gap-2">
                      💬 {conv.otherUser?.name || 'User'}
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                        {conv.unreadCount}
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {conv.messages?.[0]?.content || 'New message'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {conv.messages?.[0]?.createdAt ? new Date(conv.messages[0].createdAt).toLocaleString() : ''}
                    </p>
                  </div>
                ))}
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={async () => {
                      await markAsRead(notif.id);
                    }}
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
                <div
                  className="block p-3 text-center text-sm text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={async () => {
                    await markAllAsRead();
                    setIsOpen(false);
                    router.push('/dashboard/notifications');
                  }}
                >
                  View All
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
