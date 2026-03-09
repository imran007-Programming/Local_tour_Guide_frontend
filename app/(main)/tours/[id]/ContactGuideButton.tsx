"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatModal from "@/components/chat/ChatModal";

export default function ContactGuideButton({
  guideId,
  guideName,
  guideProfilePic,
  userRole,
}: {
  guideId: string;
  guideName: string;
  guideProfilePic: string | null;
  userRole?: string;
}) {
  const [showChat, setShowChat] = useState(false);

  const handleContact = () => {
    if (!userRole) {
      const event = new Event("openSignInModal");
      window.dispatchEvent(event);
      return;
    }
    setShowChat(true);
  };

  return (
    <>
      <button
        onClick={handleContact}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
      >
        <MessageCircle size={20} />
        Contact Guide
      </button>

      {showChat && (
        <ChatModal
          guideId={guideId}
          guideName={guideName}
          guideProfilePic={guideProfilePic}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
}
