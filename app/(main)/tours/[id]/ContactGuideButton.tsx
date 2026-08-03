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
        className="w-full flex items-center justify-center gap-2 relative overflow-hidden bg-gradient-to-b from-zinc-800 to-black text-white py-3 rounded-lg font-semibold shadow-lg shadow-black/40 border border-white/10 transition-all duration-200 hover:shadow-black/60 group"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-lg" />
        <span className="absolute inset-x-0 top-0 h-px bg-white/30 pointer-events-none" />
        <span className="absolute -inset-x-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:translate-x-[350%] transition-transform duration-700 ease-in-out pointer-events-none" />
        <MessageCircle size={20} className="relative z-10" />
        <span className="relative z-10">Contact Guide</span>
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
