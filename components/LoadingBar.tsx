"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousPathRef = useRef<string>(pathname);

  useEffect(() => {
    if (pathname !== previousPathRef.current) {
      previousPathRef.current = pathname;

      Promise.resolve().then(() => {
        setIsLoading(true);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 800);
      });
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-1 bg-linear-to-r from-red-500 via-red-400 to-red-500 z-[9999]"
          style={{
            boxShadow: "0 0 15px rgba(239, 68, 68, 0.8)",
          }}
        />
      )}
    </AnimatePresence>
  );
}
