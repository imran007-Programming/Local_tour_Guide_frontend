"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profilePic: string | null;
    role: string;
  };
};

type Conversation = {
  id: string;
  otherUser: {
    id: string;
    name: string;
    profilePic: string | null;
    role: string;
    lastSeen?: string;
  };
  messages: Message[];
  unreadCount: number;
};

let socket: Socket;

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCurrentUser().then((userId) => {
      fetchConversations();
      if (userId) {
        initializeSocket(userId);
      }
    });

    return () => {
      socket?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeSocket = async (userId: string) => {
    const { getAccessToken } = await import("@/app/actions/getAccessToken");
    const accessToken = await getAccessToken();

    socket = io(BASE_URL.replace("/api", ""), {
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });

    socket.on("connect", () => {
      socket.emit("user-online", userId);
    });

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });

      // Refresh conversations to show new conversation or update existing one
      fetchConversations();

      if (message.senderId !== userId) {
        // Only show toast if user is not in the chat page or conversation is not selected
        // toast.success(`New message from ${message.sender.name}`, {
        //   description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
        //   duration: 3000,
        // });
      }
    });

    socket.on("user-online", (onlineUserId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, onlineUserId])]);
    });

    socket.on("user-offline", (offlineUserId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId));
    });

    socket.on("user-typing", (data: { userId: string }) => {
      setTypingUsers((prev) => new Set(prev).add(data.userId));
    });

    socket.on("user-stopped-typing", (data: { userId: string }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socket.on("messages-read", (data: { conversationId: string }) => {
      // Update conversation unread count when messages are read
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === data.conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    });
  };

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv);
      if (socket) {
        socket.emit("join-conversation", selectedConv);
        socket.emit("messages-read", { conversationId: selectedConv });
      }

      // Mark messages as read and update conversation count
      markMessagesAsRead(selectedConv);
    }
  }, [selectedConv]);

  useEffect(() => {
    if (currentUserId && socket) {
      socket.emit("user-online", currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/auth/me`);
      const data = await res.json();
      if (res.ok && data.data) {
        setCurrentUserId(data.data.id);
        return data.data.id;
      }
    } catch (error) {}
    return null;
  };

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      const data = await res.json();

      // Filter out conversations where otherUser is the same as current user
      const filteredConversations = (data.data || []).filter(
        (conv: Conversation) => conv.otherUser.id !== currentUserId,
      );

      setConversations(filteredConversations);

      if (filteredConversations && Array.isArray(filteredConversations)) {
        const recentlyActive = filteredConversations
          .filter((conv: Conversation) => {
            if (!conv.otherUser.lastSeen) return false;
            const lastSeen = new Date(conv.otherUser.lastSeen);
            const now = new Date();
            const diffMins = (now.getTime() - lastSeen.getTime()) / 60000;
            return diffMins < 5;
          })
          .map((conv: Conversation) => conv.otherUser.id);
        setOnlineUsers(recentlyActive);
      }

      const convId = searchParams.get("convId");
      if (
        convId &&
        filteredConversations.some((c: Conversation) => c.id === convId)
      ) {
        setSelectedConv(convId);
      }

      const userId = searchParams.get("userId");
      if (userId) {
        setSelectedUserId(userId);
        const existingConv = filteredConversations.find(
          (c: Conversation) => c.otherUser.id === userId,
        );
        if (existingConv) {
          setSelectedConv(existingConv.id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      setIsLoadingMessages(true);
      const res = await clientAuthFetch(`${BASE_URL}/chat/${convId}/messages`);
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    const conv = conversations.find((c) => c.id === selectedConv);
    if (conv && currentUserId && socket) {
      socket.emit("typing", {
        conversationId: selectedConv,
        userId: currentUserId,
        receiverId: conv.otherUser.id,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
          conversationId: selectedConv,
          userId: currentUserId,
          receiverId: conv.otherUser.id,
        });
      }, 1000);
    }
  };

  const getLastSeenText = (lastSeen: string | undefined, isOnline: boolean) => {
    if (isOnline) return "Online";
    if (!lastSeen) return "Offline";

    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Active now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    return `Active ${diffDays}d ago`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !currentUserId) return;

    // Handle case where we have selectedUserId but no conversation yet
    if (!selectedConv && selectedUserId) {
      const messageContent = input.trim();
      setInput("");
      setIsLoading(true);

      try {
        const res = await clientAuthFetch(`${BASE_URL}/chat/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiverId: selectedUserId,
            content: messageContent,
          }),
        });

        if (res.ok) {
          const responseData = await res.json();
          if (responseData.data) {
            // Refresh conversations to get the new conversation
            await fetchConversations();
            setMessages([responseData.data]);
          }
        } else {
          setInput(messageContent);
        }
      } catch (error) {
        setInput(messageContent);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!selectedConv) return;

    const conv = conversations.find((c) => c.id === selectedConv);
    if (!conv) return;

    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: conv.otherUser.id,
          content: messageContent,
        }),
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.data) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === responseData.data.id)) return prev;
            return [...prev, responseData.data];
          });
        }
      } else {
        setInput(messageContent);
      }
    } catch (error) {
      setInput(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await clientAuthFetch(
        `${BASE_URL}/chat/conversations/${conversationId}/read`,
        {
          method: "PATCH",
        },
      );

      // Update local conversation state to set unreadCount to 0
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } catch (error) {
      console.error("Failed to mark messages as read:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[calc(100vh-100px)] md:border dark:md:border-gray-700 rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div
        className={`${selectedConv ? "hidden md:block" : "block"} w-full md:w-1/3 md:border-r dark:md:border-gray-700 overflow-y-auto`}
      >
        <div className="p-3 md:p-4 border-b dark:border-gray-700">
          <h2 className="text-lg md:text-xl font-bold">Messages</h2>
        </div>

        {isLoadingConversations ? (
          <div className="space-y-3 p-3 md:p-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 md:gap-3 p-3 md:p-4"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-6 md:p-8 text-center text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm md:text-base">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={`p-3 md:p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                selectedConv === conv.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300 flex items-center justify-center relative overflow-hidden shrink-0">
                  {conv.otherUser.profilePic ? (
                    <Image
                      src={conv.otherUser.profilePic}
                      alt={conv.otherUser.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-lg md:text-xl font-bold">
                      {conv.otherUser.name[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm md:text-base truncate">
                        {conv.otherUser.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            onlineUsers.includes(conv.otherUser.id)
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 truncate">
                    {conv.messages && conv.messages.length > 0
                      ? conv.messages[conv.messages.length - 1].content
                      : onlineUsers.includes(conv.otherUser.id)
                        ? "Online"
                        : conv.otherUser.role}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Messages Area */}
      <div
        className={`${selectedConv || selectedUserId ? "flex" : "hidden md:flex"} flex-1 flex-col min-h-0`}
      >
        {selectedConv || selectedUserId ? (
          <>
            {(() => {
              const conv = conversations.find((c) => c.id === selectedConv);
              const isTyping = conv && typingUsers.has(conv.otherUser.id);
              const isOnline = onlineUsers.includes(conv?.otherUser.id || "");

              // If no conversation but we have selectedUserId, show user info
              if (!conv && selectedUserId) {
                return (
                  <div className="p-3 md:p-4 border-b dark:border-gray-700 flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() => {
                          setSelectedConv(null);
                          setSelectedUserId(null);
                        }}
                        className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                      >
                        ←
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm md:text-base">
                            New Chat
                          </h3>
                        </div>
                        <p className="text-xs md:text-sm text-gray-500">
                          Start a conversation
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div className="p-3 md:p-4 border-b dark:border-gray-700 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      onClick={() => {
                        setSelectedConv(null);
                        setSelectedUserId(null);
                      }}
                      className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                    >
                      ←
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm md:text-base">
                          {conv?.otherUser.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            conv?.otherUser.role === "ADMIN"
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : conv?.otherUser.role === "GUIDE"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {conv?.otherUser.role}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? "bg-green-500" : "bg-gray-400"
                          }`}
                        ></span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">
                        {isTyping
                          ? "typing..."
                          : getLastSeenText(conv?.otherUser.lastSeen, isOnline)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 min-h-0">
              {isLoadingMessages ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
                    >
                      <div className="w-1/2 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 && !selectedUserId ? (
                <div className="text-center text-gray-500 mt-10 md:mt-20">
                  <MessageCircle
                    size={40}
                    className="mx-auto mb-2 opacity-50 md:w-12 md:h-12"
                  />
                  <p className="text-sm md:text-base">No messages yet</p>
                </div>
              ) : null}

              {!isLoadingMessages &&
                messages.map((msg) => {
                  const isMyMessage = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-end gap-1 md:gap-2 max-w-[85%] md:max-w-[75%]">
                        {!isMyMessage && (
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden relative">
                            {msg.sender.profilePic ? (
                              <Image
                                src={msg.sender.profilePic}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-white text-[10px] md:text-xs flex items-center justify-center h-full">
                                {msg.sender.name[0]}
                              </span>
                            )}
                          </div>
                        )}

                        <div
                          className={`rounded-2xl px-3 py-2 md:px-4 md:py-2 ${
                            isMyMessage
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                          }`}
                        >
                          {!isMyMessage && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">
                                {msg.sender.name}
                              </span>
                              <span
                                className={`text-xs px-1.5 py-0.5 rounded-full ${
                                  msg.sender.role === "ADMIN"
                                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                                    : msg.sender.role === "GUIDE"
                                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                                }`}
                              >
                                {msg.sender.role}
                              </span>
                            </div>
                          )}
                          <p className="text-xs md:text-sm break-words">
                            {msg.content}
                          </p>
                          <p className="text-[10px] md:text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {(() => {
                const typingConv = conversations.find(
                  (c) => c.id === selectedConv,
                );
                return (
                  selectedConv &&
                  typingConv &&
                  typingUsers.has(typingConv.otherUser.id) && (
                    <div className="flex justify-start">
                      <div className="flex items-end gap-1 md:gap-2">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden relative">
                          {typingConv.otherUser.profilePic ? (
                            <Image
                              src={typingConv.otherUser.profilePic}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-white text-[10px] md:text-xs flex items-center justify-center h-full">
                              {typingConv.otherUser.name[0]}
                            </span>
                          )}
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-2 py-1 md:px-3 md:py-2">
                          <div className="flex gap-1">
                            <span
                              className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></span>
                            <span
                              className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></span>
                            <span
                              className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                );
              })()}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-2 md:p-4 border-t dark:border-gray-700">
              <div className="flex gap-1 md:gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-2 md:px-4 py-2 text-sm md:text-base border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-2 md:px-4 py-2 disabled:opacity-50 flex items-center justify-center flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center">
              <MessageCircle
                size={48}
                className="mx-auto mb-4 opacity-50 md:w-16 md:h-16"
              />
              <p className="text-sm md:text-base">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
