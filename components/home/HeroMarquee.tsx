"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import img1 from "../../public/ourpartners/client-01.svg";
import img2 from "../../public/ourpartners/client-02.svg";
import img3 from "../../public/ourpartners/client-04.svg";
import img4 from "../../public/ourpartners/client-05.svg";
import img5 from "../../public/ourpartners/client-06.svg";
import img6 from "../../public/ourpartners/client-07.svg";
import img7 from "../../public/ourpartners/client-08.svg";
import img8 from "../../public/ourpartners/client-09.svg";
import img9 from "../../public/ourpartners/client-10.svg";
import img10 from "../../public/ourpartners/client-11.svg";
import img11 from "../../public/ourpartners/client-12.svg";
import img12 from "../../public/ourpartners/client-13.svg";
import img13 from "../../public/ourpartners/client-14.svg";
import img14 from "../../public/ourpartners/client-15.svg";
import img15 from "../../public/ourpartners/client-16.svg";
import img16 from "../../public/ourpartners/client-17.svg";
import img17 from "../../public/ourpartners/client-18.svg";
import img18 from "../../public/ourpartners/client-19.svg";

const row1 = [img1, img2, img3, img4, img5, img6, img7, img8, img9];
const row2 = [img10, img11, img12, img13, img14, img15, img16, img17, img18];

const names = [
  "Wander Co.", "Skyline Tech", "Nomad Labs",
  "Oceanic Travel", "Summit Group", "Horizon Ventures",
  "TripAdvisor", "Booking.com", "Airbnb",
  "GetYourGuide", "Expedia", "Viator",
  "Klook", "Lonely Planet", "Hostelworld",
  "Kayak", "Hotels.com", "Agoda",
];

function LogoCard({ src, alt }: { src: any; alt: string }) {
  return (
    <div className="shrink-0 flex items-center justify-center px-6 py-3 mx-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
      <Image
        src={src}
        alt={alt}
        width={120}
        height={48}
        className="object-contain w-28 h-12 brightness-0 invert opacity-60 hover:opacity-100 transition-opacity duration-300"
        quality={75}
      />
    </div>
  );
}

function MarqueeRow({ images, names, reverse }: { images: any[]; names: string[]; reverse?: boolean }) {
  const track = [...images, ...images];
  return (
    <div className="overflow-hidden py-2">
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {track.map((img, i) => (
          <LogoCard key={i} src={img} alt={names[i % names.length]} />
        ))}
      </motion.div>
    </div>
  );
}

export default function ClientsMarquee() {
  return (
    <section className="relative bg-zinc-950 dark:bg-zinc-950 py-14 overflow-hidden">

      {/* background glow accents */}
      <div className="pointer-events-none absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-red-600/10 blur-3xl" />

      {/* heading */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center mb-10 px-6"
      >
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-2">
          Our Partners
        </p>
        <h2 className="text-2xl font-bold text-white">
          Trusted by <span className="text-red-500">40+</span> clients around the globe
        </h2>
      </motion.div>

      {/* side gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-linear-to-r from-zinc-900 dark:from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-linear-to-l from-zinc-900 dark:from-zinc-950 to-transparent" />

      <div className="space-y-4">
        <MarqueeRow images={row1} names={names.slice(0, 6)} />
        <MarqueeRow images={row2} names={names.slice(6, 12)} reverse />
      </div>

    </section>
  );
}
