"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Compass, DollarSign, MapPin, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldLabel = "block text-sm font-semibold text-slate-950 dark:text-white";
const triggerClass =
  "mt-0.5 w-full border-0 bg-transparent p-0 text-[13px] text-slate-500 shadow-none focus:ring-0 focus-visible:ring-0 data-[size=default]:h-5 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-transparent";

const budgets = [
  { value: "any", label: "Any budget" },
  { value: "50", label: "Under $50" },
  { value: "100", label: "Under $100" },
  { value: "250", label: "Under $250" },
  { value: "500", label: "Under $500" },
];

function Field({
  icon,
  tint,
  children,
}: {
  icon: React.ReactNode;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center gap-3 px-3 py-2.5 sm:px-4">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tint}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export default function TourSearchBar({ categories }: { categories: string[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "all") params.set("category", category);
    if (budget !== "any") params.set("maxPrice", budget);
    router.push(`/explore?${params}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
      className="w-full max-w-4xl rounded-3xl bg-white p-2 text-left shadow-2xl shadow-slate-950/15 sm:rounded-full dark:bg-zinc-900"
    >
      <div className="flex flex-col sm:flex-row sm:items-center">
        <Field icon={<MapPin size={18} />} tint="bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          <label htmlFor="hero-location" className={fieldLabel}>
            Location
          </label>
          <input
            id="hero-location"
            type="text"
            placeholder="Enter your destination"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-0.5 h-5 w-full bg-transparent text-[13px] text-slate-900 outline-none placeholder:text-slate-500 dark:text-white dark:placeholder:text-zinc-400"
          />
        </Field>

        <Field icon={<Compass size={18} />} tint="bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <span className={fieldLabel}>Category</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={triggerClass} aria-label="Category">
              <SelectValue placeholder="Choose a tour type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field icon={<DollarSign size={18} />} tint="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <span className={fieldLabel}>Price</span>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger className={triggerClass} aria-label="Budget">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {budgets.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <button type="submit" className="btn-pill mt-2 justify-between sm:mt-0 sm:py-2 sm:pl-6">
          Find My Adventure
          <span className="btn-pill-icon">
            <Search size={16} />
          </span>
        </button>
      </div>
    </form>
  );
}
