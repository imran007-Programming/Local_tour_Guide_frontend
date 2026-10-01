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
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-slate-200 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
      >
        <MessageCircle size={16} />
        Message the guide
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
