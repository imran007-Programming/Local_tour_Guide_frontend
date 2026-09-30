"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import ContactGuideButton from "../../tours/[id]/ContactGuideButton";

// Booking actions depend on who is signed in, so they render on the client
export default function GuideActions({
  guideUserId,
  guideName,
  guideProfilePic,
  tourCount,
}: {
  guideUserId: string;
  guideName: string;
  guideProfilePic: string | null;
  tourCount: number;
}) {
  const role = useCurrentUser()?.data?.role;
  const canContact = !role || role === "TOURIST";

  return (
    <div className="space-y-2">
      {tourCount > 0 && (
        <a
          href="#tours"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          See {tourCount} tour{tourCount === 1 ? "" : "s"}
        </a>
      )}
      {canContact && (
        <ContactGuideButton
          guideId={guideUserId}
          guideName={guideName}
          guideProfilePic={guideProfilePic}
          userRole={role}
        />
      )}
    </div>
  );
}
