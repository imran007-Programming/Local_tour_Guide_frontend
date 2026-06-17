"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Mail, Globe, ArrowLeft,
  Calendar, MessageSquare, BadgeCheck,
  DollarSign,
} from "lucide-react";
import { CLIENT_BASE_URL } from "@/lib/config";

interface Guide {
  id: string;
  name: string;
  email: string;
  profilePic: string | null;
  bio: string | null;
  languages: string[];
  guide: {
    id: string;
    expertise: string[];
    dailyRate: number;
    averageRating?: number;
    totalReviews?: number;
    _count: { bookings: number; reviews: number };
  };
}

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function GuideProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState("/hero/Hero1.jpg");

  useEffect(() => {
    fetch(`${CLIENT_BASE_URL}/guides`)
      .then((r) => r.json())
      .then((data) => {
        const list: Guide[] = data.data || [];
        const found = list.find(
          (g) => toSlug(g.name) === id || g.id === id || g.guide?.id === id
        );
        setGuide(found ?? null);
        if (found?.profilePic) setImgSrc(found.profilePic);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:block w-2/5 bg-gray-200 dark:bg-zinc-800 animate-pulse" />
        <div className="flex-1 p-12 space-y-6 animate-pulse">
          <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-10 w-64 bg-gray-200 dark:bg-zinc-800 rounded-xl mt-8" />
          <div className="h-4 w-40 bg-gray-100 dark:bg-zinc-900 rounded-xl" />
          <div className="h-24 bg-gray-100 dark:bg-zinc-900 rounded-xl mt-4" />
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-400">
        <p className="text-lg font-semibold">Guide not found</p>
        <Link href="/guides" className="text-red-500 hover:underline text-sm flex items-center gap-1">
          <ArrowLeft size={14} /> Back to Guides
        </Link>
      </div>
    );
  }

  const rating   = guide.guide?.averageRating ?? 0;
  const totalRev = guide.guide?.totalReviews  ?? 0;
  const rate     = guide.guide?.dailyRate      ?? 0;
  const expertise = guide.guide?.expertise?.filter(Boolean) ?? [];
  const bookings = guide.guide?._count?.bookings ?? 0;
  const reviews  = guide.guide?._count?.reviews  ?? 0;
  const langs    = guide.languages?.filter(Boolean) ?? [];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950">

      {/* ── FULL content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">

          {/* Back */}
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition">
            <ArrowLeft size={14} /> Back to Guides
          </Link>

          {/* Profile header */}
          <div className="flex items-start gap-6 bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={guide.name}
              className="rounded-2xl object-cover object-top shrink-0 shadow-lg"
              style={{ width: 200, height: 200 }}
              onError={() => setImgSrc("/avatar.png")}
            />
            <div className="flex-1 pt-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{guide.name}</h1>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                  <BadgeCheck size={11} /> Verified
                </span>
              </div>
              <p className="text-sm text-gray-400 flex items-center gap-1.5 mb-2">
                <Mail size={12} /> {guide.email}
              </p>
              {langs.length > 0 && (
                <p className="text-sm text-gray-400 flex items-center gap-1.5 mb-3">
                  <Globe size={12} /> {langs.join(", ")}
                </p>
              )}
              {rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={13}
                        className={s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-zinc-700 dark:text-zinc-700"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({totalRev})</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-3 gap-3"
          >
            {[
              { icon: <Calendar size={18} className="text-red-500" />, value: bookings, label: "Trips" },
              { icon: <MessageSquare size={18} className="text-red-500" />, value: reviews, label: "Reviews" },
              { icon: <Star size={18} className="text-yellow-400" />, value: rating > 0 ? rating.toFixed(1) : "—", label: "Rating" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center shadow-sm">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* About */}
          {guide.bio && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">About</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{guide.bio}</p>
              </div>
            </motion.div>
          )}

          {/* Expertise */}
          {expertise.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {expertise.map((exp, i) => (
                  <span key={i}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                  >
                    {exp}
                  </span>
                ))}
              </div>
              </div>
            </motion.div>
          )}

          {/* Languages */}
          {langs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Languages</h2>
              <div className="flex flex-wrap gap-2">
                {langs.map((lang, i) => (
                  <span key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                  >
                    <Globe size={12} /> {lang}
                  </span>
                ))}
              </div>
              </div>
            </motion.div>
          )}

          {/* Booking CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="sticky bottom-6 pt-4"
          >
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 shadow-xl shadow-gray-300/60 dark:shadow-none flex items-center justify-between gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Daily Rate</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-1">
                  <DollarSign size={18} className="text-red-500" />
                  {rate > 0 ? rate : "—"}
                  {rate > 0 && <span className="text-sm font-normal text-gray-400 ml-1">/ day</span>}
                </p>
              </div>
              <Link
                href="/explore"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm whitespace-nowrap shadow-lg shadow-red-200 dark:shadow-none"
              >
                Book Now
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
