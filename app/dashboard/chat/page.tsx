"use client";

import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Loader2,
  Search,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { io, Socket } from "socket.io-client";
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
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCurrentUser().then((userId) => {
      fetchConversations();
      if (userId) initializeSocket(userId);
    });
    return () => { socket?.disconnect(); };
  }, []);

  const initializeSocket = async (userId: string) => {
    const { getAccessToken } = await import("@/app/actions/getAccessToken");
    const accessToken = await getAccessToken();

    socket = io(BASE_URL.replace("/api", ""), {
      withCredentials: true,
      auth: { token: accessToken },
    });

    socket.on("connect", () => socket.emit("user-online", userId));

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
      fetchConversations();
    });

    socket.on("user-online", (id: string) =>
      setOnlineUsers((prev) => [...new Set([...prev, id])])
    );
    socket.on("user-offline", (id: string) =>
      setOnlineUsers((prev) => prev.filter((uid) => uid !== id))
    );
    socket.on("user-typing", (data: { userId: string }) =>
      setTypingUsers((prev) => new Set(prev).add(data.userId))
    );
    socket.on("user-stopped-typing", (data: { userId: string }) =>
      setTypingUsers((prev) => { const s = new Set(prev); s.delete(data.userId); return s; })
    );
    socket.on("messages-read", (data: { conversationId: string }) =>
      setConversations((prev) =>
        prev.map((c) => (c.id === data.conversationId ? { ...c, unreadCount: 0 } : c))
      )
    );
  };

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv);
      if (socket) {
        socket.emit("join-conversation", selectedConv);
        socket.emit("messages-read", { conversationId: selectedConv });
      }
      markMessagesAsRead(selectedConv);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/auth/me`);
      const data = await res.json();
      if (res.ok && data.data) { setCurrentUserId(data.data.id); return data.data.id; }
    } catch {} return null;
  };

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      const data = await res.json();
      const filtered = (data.data || []).filter((c: Conversation) => c.otherUser.id !== currentUserId);
      setConversations(filtered);

      const recentlyActive = filtered
        .filter((c: Conversation) => {
          if (!c.otherUser.lastSeen) return false;
          return (new Date().getTime() - new Date(c.otherUser.lastSeen).getTime()) / 60000 < 5;
        })
        .map((c: Conversation) => c.otherUser.id);
      setOnlineUsers(recentlyActive);

      const convId = searchParams.get("convId");
      if (convId && filtered.some((c: Conversation) => c.id === convId)) setSelectedConv(convId);

      const userId = searchParams.get("userId");
      if (userId) {
        setSelectedUserId(userId);
        const existing = filtered.find((c: Conversation) => c.otherUser.id === userId);
        if (existing) setSelectedConv(existing.id);
      }
    } catch {} finally { setIsLoadingConversations(false); }
  };

  const fetchMessages = async (convId: string) => {
    try { setIsLoadingMessages(true); const res = await clientAuthFetch(`${BASE_URL}/chat/${convId}/messages`); const data = await res.json(); setMessages(data.data || []); }
    catch {} finally { setIsLoadingMessages(false); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    const conv = conversations.find((c) => c.id === selectedConv);
    if (conv && currentUserId && socket) {
      socket.emit("typing", { conversationId: selectedConv, userId: currentUserId, receiverId: conv.otherUser.id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { conversationId: selectedConv, userId: currentUserId, receiverId: conv.otherUser.id });
      }, 1000);
    }
  };

  const getLastSeenText = (lastSeen: string | undefined, isOnline: boolean) => {
    if (isOnline) return "Online";
    if (!lastSeen) return "Offline";
    const diffMins = Math.floor((new Date().getTime() - new Date(lastSeen).getTime()) / 60000);
    if (diffMins < 1) return "Active now";
    if (diffMins < 60) return `Active ${diffMins}m ago`;
    if (diffMins < 1440) return `Active ${Math.floor(diffMins / 60)}h ago`;
    return `Active ${Math.floor(diffMins / 1440)}d ago`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !currentUserId) return;

    if (!selectedConv && selectedUserId) {
      const content = input.trim(); setInput(""); setIsLoading(true);
      try {
        const res = await clientAuthFetch(`${BASE_URL}/chat/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receiverId: selectedUserId, content }) });
        if (res.ok) { const d = await res.json(); if (d.data) { await fetchConversations(); setMessages([d.data]); } } else { setInput(content); }
      } catch { setInput(content); } finally { setIsLoading(false); } return;
    }

    if (!selectedConv) return;
    const conv = conversations.find((c) => c.id === selectedConv);
    if (!conv) return;
    const content = input.trim(); setInput(""); setIsLoading(true);
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/send`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ receiverId: conv.otherUser.id, content }) });
      if (res.ok) { const d = await res.json(); if (d.data) { setMessages((prev) => prev.some((m) => m.id === d.data.id) ? prev : [...prev, d.data]); } } else { setInput(content); }
    } catch { setInput(content); } finally { setIsLoading(false); }
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await clientAuthFetch(`${BASE_URL}/chat/conversations/${conversationId}/read`, { method: "PATCH" });
      setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)));
    } catch {}
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConvData = conversations.find((c) => c.id === selectedConv);
  const isTyping = selectedConvData && typingUsers.has(selectedConvData.otherUser.id);
  const isOnline = onlineUsers.includes(selectedConvData?.otherUser.id || "");

  return (
    <div className="flex h-[calc(100vh-180px)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      {/* ===== LEFT: Conversations List ===== */}
      <div
        className={`${selectedConv || selectedUserId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[340px] border-r border-zinc-200 dark:border-zinc-800`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Messages</h2>
          <div className="relative mt-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <MessageCircle size={40} className="text-zinc-300 dark:text-zinc-600 mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {searchTerm ? "No conversations found" : "No messages yet"}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = selectedConv === conv.id;
              const userOnline = onlineUsers.includes(conv.otherUser.id);
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-red-50 dark:bg-red-900/10 border-l-2 border-red-500"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border-l-2 border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                      {conv.otherUser.profilePic ? (
                        <Image src={conv.otherUser.profilePic} alt="" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400">
                          {conv.otherUser.name[0]}
                        </div>
                      )}
                    </div>
                    {userOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {conv.otherUser.name}
                      </h4>
                      {conv.messages?.[0]?.createdAt && (
                        <span className="text-[10px] text-zinc-400 shrink-0 ml-2">
                          {new Date(conv.messages[0].createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {typingUsers.has(conv.otherUser.id)
                          ? "typing..."
                          : conv.messages?.[0]?.content || (userOnline ? "Online" : conv.otherUser.role)}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1 font-bold shrink-0 ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== RIGHT: Chat Area ===== */}
      <div className={`${selectedConv || selectedUserId ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0`}>
        {selectedConv || selectedUserId ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setSelectedConv(null); setSelectedUserId(null); }}
                  className="md:hidden p-2 -ml-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
                >
                  <ArrowLeft size={20} className="text-zinc-600 dark:text-zinc-400" />
                </button>
                {selectedConvData && (
                  <>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                        {selectedConvData.otherUser.profilePic ? (
                          <Image src={selectedConvData.otherUser.profilePic} alt="" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-500">
                            {selectedConvData.otherUser.name[0]}
                          </div>
                        )}
                      </div>
                      {isOnline && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {selectedConvData.otherUser.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {isTyping
                          ? <span className="text-emerald-500">typing...</span>
                          : getLastSeenText(selectedConvData.otherUser.lastSeen, isOnline)}
                      </p>
                    </div>
                  </>
                )}
                {!selectedConvData && selectedUserId && (
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">New Chat</h3>
                    <p className="text-xs text-zinc-500">Start a conversation</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3 bg-zinc-50 dark:bg-zinc-950">
              {isLoadingMessages ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                      <div className={`h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse ${i % 2 === 0 ? "w-2/5" : "w-1/3"}`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-3">
                    <MessageCircle size={28} className="text-zinc-400" />
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No messages yet</p>
                  <p className="text-xs text-zinc-400 mt-1">Send a message to start the conversation</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUserId;
                  const showAvatar = !isMe && (i === 0 || messages[i - 1]?.senderId === currentUserId);
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`flex items-end gap-2 max-w-[75%] ${isMe ? "flex-row-reverse" : ""}`}>
                        {!isMe && (
                          <div className={`w-7 h-7 rounded-full overflow-hidden shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
                            {msg.sender.profilePic ? (
                              <Image src={msg.sender.profilePic} alt="" width={28} height={28} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                                {msg.sender.name[0]}
                              </div>
                            )}
                          </div>
                        )}
                        <div
                          className={`px-3.5 py-2 text-sm rounded-2xl ${
                            isMe
                              ? "bg-red-600 text-white rounded-br-md"
                              : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-bl-md border border-zinc-200 dark:border-zinc-700"
                          }`}
                        >
                          <p className="break-words leading-relaxed">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-red-200" : "text-zinc-400"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Typing indicator */}
              {isTyping && selectedConvData && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-zinc-300 dark:bg-zinc-700 overflow-hidden shrink-0">
                      {selectedConvData.otherUser.profilePic ? (
                        <Image src={selectedConvData.otherUser.profilePic} alt="" width={28} height={28} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                          {selectedConvData.otherUser.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 md:px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-0 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/40 placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
              <MessageCircle size={36} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Your Messages</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">
              Select a conversation from the left to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
