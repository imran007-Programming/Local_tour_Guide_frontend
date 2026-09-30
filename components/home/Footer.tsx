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
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-900 dark:bg-zinc-950">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <MapPin className="h-4 w-4 text-white dark:text-zinc-900" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-900 dark:text-white">
              TourGuide
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Authentic tours with verified local guides. Travel like a local, wherever you go.
          </p>
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">+1 56589 54598</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-white">{col.title}</h4>
            <ul className="mt-4 space-y-3 text-sm">
              {col.items.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-zinc-500 dark:text-zinc-400">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-900">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} TourGuide. All rights reserved.
          </p>
          <div className="flex gap-1">
            {socials.map(({ Icon, label }) => (
              <span
                key={label}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
              >
                <Icon size={17} strokeWidth={1.75} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
