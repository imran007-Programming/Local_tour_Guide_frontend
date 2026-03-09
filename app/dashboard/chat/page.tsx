"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { io, Socket } from "socket.io-client";

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
  };
  messages: Message[];
  unreadCount: number;
};

let socket: Socket;

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();

    // Initialize Socket.IO
    socket = io(BASE_URL.replace('/api', ''), {
      withCredentials: true,
    });

    socket.on("connect", () => {});

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socket.on("user-offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv);
      socket.emit("join-conversation", selectedConv);
    }
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat/conversations`, {
        credentials: "include",
      });
      const data = await res.json();
      setConversations(data.data || []);
    } catch (error) {}
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`${BASE_URL}/chat/${convId}/messages`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {}
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedConv || isLoading) return;

    const conv = conversations.find((c) => c.id === selectedConv);
    if (!conv) return;

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: conv.otherUser.id,
          content: input,
        }),
      });

      if (res.ok) {
        setInput("");
      }
    } catch (error) {} finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)] border dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r dark:border-gray-700 overflow-y-auto">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConv(conv.id)}
              className={`p-4 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                selectedConv === conv.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  {conv.otherUser.profilePic ? (
                    <img
                      src={conv.otherUser.profilePic}
                      alt={conv.otherUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold">
                      {conv.otherUser.name[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{conv.otherUser.name}</h3>
                      {onlineUsers.includes(conv.otherUser.id) && (
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {onlineUsers.includes(conv.otherUser.id) ? "Online" : conv.otherUser.role}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                  <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
                  <p>No messages yet</p>
                </div>
              )}
              
              {messages.map((msg) => {
                const isMyMessage = msg.senderId === msg.sender.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMyMessage ? "justify-start" : "justify-end"}`}
                  >
                    <div className="flex items-end gap-2 max-w-[75%]">
                      {isMyMessage && (
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0 overflow-hidden">
                          {msg.sender.profilePic ? (
                            <img src={msg.sender.profilePic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-xs flex items-center justify-center h-full">
                              {msg.sender.name[0]}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isMyMessage
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                            : "bg-blue-600 text-white rounded-br-none"
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
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
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
