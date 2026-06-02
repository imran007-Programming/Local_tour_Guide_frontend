"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const FollowCursor = dynamic(() => import("@/components/magneticmouse/MagnaticMouse"), {
  ssr: false,
});

export default function FollowCursorWrapper() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return <FollowCursor />;
}
