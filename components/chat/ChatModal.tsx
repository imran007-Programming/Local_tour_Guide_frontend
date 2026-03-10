"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Circle } from "lucide-react";
import { BASE_URL } from "@/lib/config";
import { clientAuthFetch } from "@/lib/clientAuthFetch";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import Image from "next/image";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    profilePic: string | null;
  };
};

let socket: Socket;

export default function ChatModal({
  guideId,
  guideName,
  guideProfilePic,
  onClose,
}: {
  guideId: string;
  guideName: string;
  guideProfilePic: string | null;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    initChat();

    const accessToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1];

    socket = io(BASE_URL.replace('/api', ''), {
      withCredentials: true,
      auth: {
        token: accessToken
      }
    });

    socket.on("new-message", (message: Message) => {
      if (message.senderId !== currentUserId) {
        setMessages((prev) => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
        toast.success(`New message from ${message.sender.name}`, {
          description: message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''),
          duration: 3000,
        });
      }
    });

    socket.on("user-online", (userId: string) => {
      if (userId === guideId) setIsOnline(true);
    });

    socket.on("user-offline", (userId: string) => {
      if (userId === guideId) setIsOnline(false);
    });

    socket.on("user-typing", (data: { userId: string }) => {
      if (data.userId === guideId) setIsTyping(true);
    });

    socket.on("user-stopped-typing", (data: { userId: string }) => {
      if (data.userId === guideId) setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchCurrentUser = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/auth/me`);
      const data = await res.json();
      if (res.ok && data.data) {
        setCurrentUserId(data.data.id);
      }
    } catch (error) {
      console.error("Fetch user error:", error);
    }
  };

  const initChat = async () => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/conversations`);
      const data = await res.json();
      
      if (res.ok && data.data) {
        const existingConv = data.data.find(
          (conv: { otherUser: { id: string } }) => conv.otherUser.id === guideId
        );
        
        if (existingConv) {
          setConversationId(existingConv.id);
          socket.emit("join-conversation", existingConv.id);
          fetchMessages(existingConv.id);
        }
      }
    } catch (error) {
      console.error("Init chat error:", error);
    }
  };

  const fetchMessages = async (convId: string) => {
    try {
      const res = await clientAuthFetch(`${BASE_URL}/chat/${convId}/messages`);
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {}
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    if (conversationId && currentUserId) {
      socket.emit("typing", { conversationId, userId: currentUserId, receiverId: guideId });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", { conversationId, userId: currentUserId, receiverId: guideId });
      }, 1000);
    }
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
          receiverId: guideId,
          content: messageContent,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        console.error("Send message failed:", responseData);
        setInput(messageContent);
        return;
      }

      if (!conversationId && responseData.data?.conversationId) {
        const convId = responseData.data.conversationId;
        setConversationId(convId);
        socket.emit("join-conversation", convId);
      }

      if (responseData.data) {
        setMessages((prev) => {
          if (prev.some(m => m.id === responseData.data.id)) return prev;
          return [...prev, responseData.data];
        });
      }
    } catch (error) {
      console.error("Send message error:", error);
      setInput(messageContent);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl h-[85vh] md:h-150 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 md:p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden relative">
                {guideProfilePic ? (
                  <Image src={guideProfilePic} alt={guideName} fill className="object-cover" />
                ) : (
                  <span className="text-base md:text-lg font-bold">{guideName[0]}</span>
                )}
              </div>
              <Circle
                size={10}
                className={`absolute bottom-0 right-0 md:w-3 md:h-3 ${
                  isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm md:text-base truncate">{guideName}</h3>
              <p className="text-[10px] md:text-xs truncate">{isTyping ? "typing..." : isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 rounded p-1 shrink-0">
            <X size={18} className="md:w-5 md:h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50 dark:bg-gray-800">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10 md:mt-20">
              <MessageCircle size={40} className="mx-auto mb-2 opacity-50 md:w-12 md:h-12" />
              <p className="text-sm md:text-base">Start the conversation!</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === guideId ? "justify-start" : "justify-end"}`}
            >
              <div className="flex items-end gap-1 md:gap-2 max-w-[85%] md:max-w-[75%]">
                {msg.senderId === guideId && (
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden relative">
                    {guideProfilePic ? (
                      <Image src={guideProfilePic} alt="" fill className="object-cover" />
                    ) : (
                      <span className="text-white text-[10px] md:text-xs flex items-center justify-center h-full">{guideName[0]}</span>
                    )}
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-3 py-2 md:px-4 md:py-2 ${
                    msg.senderId === guideId
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                      : "bg-blue-600 text-white rounded-br-none"
                  }`}
                >
                  <p className="text-xs md:text-sm text-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] md:text-xs opacity-70 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end gap-1 md:gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden relative">
                  {guideProfilePic ? (
                    <Image src={guideProfilePic} alt="" fill className="object-cover" />
                  ) : (
                    <span className="text-white text-[10px] md:text-xs flex items-center justify-center h-full">{guideName[0]}</span>
                  )}
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-2 py-1 md:px-3 md:py-2">
                  <div className="flex gap-1">
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 md:px-4 md:py-2 text-base border dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-800"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 disabled:opacity-50 shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
