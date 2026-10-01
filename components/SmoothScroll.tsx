"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Pauses Lenis whenever something locks page scroll: Radix dialogs/selects
 * mark the body with `data-scroll-locked`, the mobile menu sets overflow hidden.
 */
function PauseWhenLocked() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const body = document.body;
    const sync = () => {
      const locked = body.hasAttribute("data-scroll-locked") || body.style.overflow === "hidden";
      if (locked) lenis.stop();
      else lenis.start();
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(body, { attributes: true, attributeFilter: ["style", "data-scroll-locked"] });
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Keep native wheel scrolling for people who ask for reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: !reducedMotion,
        anchors: true,
        // dropdown lists, modals and other inner scroll areas keep scrolling natively
        allowNestedScroll: true,
      }}
    >
      <PauseWhenLocked />
      {children}
    </ReactLenis>
  );
}
