import type { ReactNode } from "react";

/** Centered heading with a giant faded word behind it (DESTINATION, TESTIMONIAL …). */
export default function SectionHeading({
  watermark,
  title,
  subtitle,
  children,
}: {
  watermark: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <div className="relative py-8 sm:py-12">
        <span aria-hidden className="watermark">
          {watermark}
        </span>
        <h2 className="relative text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem] dark:text-white">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-slate-600 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
