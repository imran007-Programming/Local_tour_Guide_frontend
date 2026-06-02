"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import ChatModal from "@/components/chat/ChatModal";
import SignInModal from "@/components/Auth/Login";

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
  const [signInOpen, setSignInOpen] = useState(false);

  const handleContact = () => {
    if (!userRole) {
      setSignInOpen(true);
      return;
    }
    if (userRole === "GUIDE" || userRole === "ADMIN") {
      setSignInOpen(true);
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
          isOpen={showChat}
          targetUser={{
            id: guideId,
            name: guideName,
            profilePic: guideProfilePic,
            email: '',
            role: 'GUIDE'
          }}
          onClose={() => setShowChat(false)}
        />
      )}

      <SignInModal
        open={signInOpen}
        setOpen={setSignInOpen}
        setRegisterOpen={() => {}}
      />
    </>
  );
}
