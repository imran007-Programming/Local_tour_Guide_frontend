import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin } from "lucide-react";

type FooterItem = { label: string; href?: string };

const columns: { title: string; items: FooterItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "All tours", href: "/explore" },
      { label: "Local guides", href: "/guides" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    items: [{ label: "About us" }, { label: "Careers" }, { label: "Blog" }, { label: "Partners" }],
  },
  {
    title: "Support",
    items: [
      { label: "Contact us", href: "mailto:info@example.com" },
      { label: "Privacy policy" },
      { label: "Terms & conditions" },
      { label: "Refund policy" },
    ],
  },
];

const socials = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white dark:border-t dark:border-zinc-900 dark:bg-black">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.6fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-1.5">
            <MapPin className="h-6 w-6 fill-white text-slate-950" strokeWidth={2.25} />
            <span className="font-display text-xl uppercase tracking-wide">TourGuide</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Explore the world&apos;s hidden treasures, waiting to be discovered with local guides.
          </p>
          <p className="mt-4 text-sm text-slate-400">+1 56589 54598</p>
          <div className="mt-6 flex gap-2">
            {socials.map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition-colors hover:bg-blue-500 hover:text-white"
              >
                <Icon size={16} strokeWidth={1.75} />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-slate-400">{col.title}</h4>
            <ul className="mt-5 space-y-3.5 text-sm">
              {col.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link href={item.href} className="text-white transition-colors hover:text-blue-400">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-slate-200">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-page">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 border-t border-white/15 py-7 text-sm text-slate-300">
          <span>© {new Date().getFullYear()} TourGuide. All rights reserved.</span>
          <span className="text-white/30">|</span>
          <span>Privacy Policy</span>
          <span className="text-white/30">|</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
