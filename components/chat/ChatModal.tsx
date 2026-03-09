"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2, Circle } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChat();

    socket = io("http://localhost:5000", {
      withCredentials: true,
    });

    socket.on("new-message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("user-online", (userId: string) => {
      if (userId === guideId) setIsOnline(true);
    });

    socket.on("user-offline", (userId: string) => {
      if (userId === guideId) setIsOnline(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initChat = async () => {
    try {
      const res = await fetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: guideId,
          content: "Hi, I'm interested in your tour!",
        }),
      });

      const data = await res.json();
      console.log("Chat API Response:", data);
      
      if (!res.ok) {
        console.error("Chat API Error:", data);
        return;
      }
      
      const convId = data.data.conversationId;
      setConversationId(convId);

      socket.emit("join-conversation", convId);
      fetchMessages(convId);
    } catch (error) {
      console.error("Init chat error:", error);
    }
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
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      await fetch(`${BASE_URL}/chat/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          receiverId: guideId,
          content: input,
        }),
      });

      setInput("");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {guideProfilePic ? (
                  <img src={guideProfilePic} alt={guideName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold">{guideName[0]}</span>
                )}
              </div>
              <Circle
                size={12}
                className={`absolute bottom-0 right-0 ${
                  isOnline ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                }`}
              />
            </div>
            <div>
              <h3 className="font-semibold">{guideName}</h3>
              <p className="text-xs">{isOnline ? "Online" : "Offline"}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-blue-700 rounded p-1">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <MessageCircle size={48} className="mx-auto mb-2 opacity-50" />
              <p>Start the conversation!</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === guideId ? "justify-start" : "justify-end"}`}
            >
              <div className="flex items-end gap-2 max-w-[75%]">
                {msg.senderId === guideId && (
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0 overflow-hidden">
                    {guideProfilePic ? (
                      <img src={guideProfilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs flex items-center justify-center h-full">{guideName[0]}</span>
                    )}
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.senderId === guideId
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
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
          ))}
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
      </div>
    </div>
  );
}
