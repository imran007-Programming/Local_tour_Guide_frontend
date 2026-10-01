"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
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

const logos = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];

export default function ClientsMarquee() {
  return (
    <section className="bg-white py-10 dark:bg-zinc-950">
      <div className="container-page">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Trusted by 40+ travel partners worldwide
        </p>
        <div className="relative mt-6 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <Marquee pauseOnHover className="[--duration:40s] [--gap:3rem]">
            {logos.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt="Partner logo"
                width={112}
                height={40}
                className="h-8 w-28 object-contain opacity-50 grayscale transition-opacity hover:opacity-90 dark:brightness-0 dark:invert"
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
