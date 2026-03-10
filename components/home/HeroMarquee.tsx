"use client";
import Image from "next/image";
import { Variants, motion } from "framer-motion";
import { Marquee } from "../ui/marquee";
import img1 from "../../public/ourpartners/client-01.svg";
import img2 from "../../public/ourpartners/client-02.svg";
import img3 from "../../public/ourpartners/client-04.svg";
import img4 from "../../public/ourpartners/client-05.svg";
import img5 from "../../public/ourpartners/client-06.svg";
import img6 from "../../public/ourpartners/client-07.svg";

const companies = [
  {
    name: "Wander Co.",
    image: img1,
  },
  {
    name: "Skyline Tech",
    image: img2,
  },
  {
    name: "Nomad Labs",
    image: img3,
  },
  {
    name: "Oceanic Travel",
    image: img4,
  },
  {
    name: "Summit Group",
    image: img5,
  },
  {
    name: "Summit Group",
    image: img6,
  },
];

export default function ClientsMarquee() {
  const sectionVariant: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative bg-white dark:bg-black py-20 overflow-hidden transition-colors duration-300">
      <motion.div
        variants={sectionVariant}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-6xl mx-auto text-center mb-5"
      >
        <h2 className="text-md font-semibold text-gray-700 dark:text-white">
          Trusted By 40+ Clients Around the Globe
        </h2>
      </motion.div>

      <div className="relative">
        <Marquee pauseOnHover className="[--duration:25s]">
          {[...companies, ...companies].map((company, index) => (
            <div key={index} className="mx-12 flex items-center justify-center">
              <Image
                src={company.image}
                alt={company.name}
                width={140}
                height={60}
                className="
              object-contain

              transition duration-300
            "
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
