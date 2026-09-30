"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// lottie-web and the 240 KB animation file are only downloaded when this
// component actually renders, instead of being part of the page bundle.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function SuccessAnimation({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let active = true;
    import("@/public/payment_success/success.json").then((mod) => {
      if (active) setAnimationData(mod.default);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!animationData) return <div className={className} style={style} />;

  return <Lottie animationData={animationData} loop={false} className={className} style={style} />;
}
