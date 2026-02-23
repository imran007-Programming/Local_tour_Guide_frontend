"use client";
import { Play } from "lucide-react";
import Image from "next/image";
import paralax from "../../public/hero/priscilla-du-preez-KoF1cXdF9Ws-unsplash.jpg";
import ClientsMarquee from "./HeroMarquee";
export default function ParallaxHero() {
  return (
    <>
      {/* Fixed Background Layer */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Image
          src={paralax}
          alt="Hero Background"
          fill
          className="w-full h-full object-cover rounded-3xl! "
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content Section */}
      <section className="relative h-[40vh] flex items-center justify-center">
        <button className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-300">
          <Play className="w-8 h-8 text-black ml-1" />
        </button>
      </section>

      {/* Scrollable Section */}
      <section className="relative dark:bg-black bg-white   py-2">
        <ClientsMarquee />
      </section>
    </>
  );
}
