"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { toast } from "sonner";
import Image from "next/image";
import { io, Socket } from "socket.io-client";

let socket: Socket;

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

type User = {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  role: string;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User;
}

export default function ChatModal({ isOpen, onClose, targetUser }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCurrentUser().then((userId) => {
        if (userId) {
          initializeSocket(userId);
        }
      });
      fetchMessages();
    }
    
    return () => {
      socket?.disconnect();
    };
  }, [isOpen, targetUser.id]);

  const initializeSocket = async (userId: string) => {
    const { getAccessToken } = await import("@/app/actions/getAccessToken");
    const accessToken = await getAccessToken();

    socket = io(BASE_URL.replace('/api', ''), {
      withCredentials: true,
      auth: {
        token: accessToken
      }
    });

    socket.on("connect", () => {
      socket.emit("user-online", userId);
    });

    socket.on("new-message", (message: Message) => {
      if (message.senderId === targetUser.id || message.senderId === userId) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });
  };

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

  const fetchMessages = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      const data = await res.json();
      
      if (data.data) {
        const conversation = data.data.find((conv: any) => 
          conv.otherUser.id === targetUser.id
        );
        
        if (conversation) {
          const messagesRes = await clientAuthFetch(`${BASE_URL}/chat/${conversation.id}/messages`);
          const messagesData = await messagesRes.json();
          setMessages(messagesData.data || []);
        }
      }
    } catch (error) {}
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !currentUserId) return;

    const messageContent = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: targetUser.id,
          content: messageContent,
        }),
      });

      if (res.ok) {
        const responseData = await res.json();
        if (responseData.data) {
          setMessages((prev) => [...prev, responseData.data]);
          toast.success("Message sent");
        }
      } else {
        setInput(messageContent);
        toast.error("Failed to send message");
      }
    } catch (error) {
      setInput(messageContent);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center relative overflow-hidden">
              {targetUser.profilePic ? (
                <Image
                  src={targetUser.profilePic}
                  alt={targetUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-lg font-bold">
                  {targetUser.name[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold">{targetUser.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  targetUser.role === "ADMIN"
                    ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                    : targetUser.role === "GUIDE"
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                }`}>
                  {targetUser.role}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p>Start a conversation with {targetUser.name}</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMyMessage = msg.senderId === currentUserId;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!isMyMessage && (
                      <div className="w-6 h-6 rounded-full bg-gray-400 shrink-0 overflow-hidden relative">
                        {msg.sender.profilePic ? (
                          <Image src={msg.sender.profilePic} alt="" fill className="object-cover" />
                        ) : (
                          <span className="text-white text-xs flex items-center justify-center h-full">
                            {msg.sender.name[0]}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`rounded-2xl px-3 py-2 ${
                        isMyMessage
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium">{msg.sender.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                            msg.sender.role === "ADMIN"
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                              : msg.sender.role === "GUIDE"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                          }`}>
                            {msg.sender.role}
                          </span>
                        </div>
                      )}
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder={`Message ${targetUser.name}...`}
              className="flex-1 px-3 py-2 border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}