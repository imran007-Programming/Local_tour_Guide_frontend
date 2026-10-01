import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CTA_IMAGE =
  "https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=2000&q=75";

export default function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-white dark:bg-zinc-950">
      <Image
        src={CTA_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_70%]"
      />
      {/* Fade the photo in from the page background */}
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-white via-white/75 to-white/10 dark:from-zinc-950 dark:via-zinc-950/80 dark:to-zinc-950/30" />

      <div className="container-page flex flex-col items-center py-28 text-center md:py-36">
        <h2 className="display-title text-5xl sm:text-7xl lg:text-8xl">Start your adventure</h2>
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-700 dark:text-zinc-300">
          Browse hundreds of tours led by people who live there — or share your own city with
          travellers as a local guide.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/explore" className="btn-pill group">
            Find a tour
            <span className="btn-pill-icon">
              <ArrowUpRight size={16} />
            </span>
          </Link>
          <Link href="/guides" className="btn-dark">
            Meet the guides
          </Link>
        </div>
      </div>
    </section>
  );
}
