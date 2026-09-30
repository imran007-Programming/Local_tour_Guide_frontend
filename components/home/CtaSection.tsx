import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="bg-white pb-20 md:pb-24 dark:bg-zinc-950">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-zinc-900 px-8 py-12 sm:px-12 md:flex-row md:items-center dark:bg-zinc-900">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">
              Ready for your next trip?
            </h2>
            <p className="mt-3 text-zinc-400">
              Browse hundreds of tours led by locals, or share your own city as a guide.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Find a tour
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Meet the guides
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
