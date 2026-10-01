"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const labelClass = "mb-2 block text-sm font-medium text-slate-950 dark:text-white";
const fieldClass =
  "h-12 w-full rounded-xl border-0 bg-slate-100 px-4 text-sm text-slate-900 outline-none ring-blue-500/40 transition placeholder:text-slate-400 focus:ring-2 dark:bg-zinc-800/70 dark:text-white dark:placeholder:text-zinc-500";
const selectClass =
  "h-12! w-full rounded-xl border-0 bg-slate-100 px-4 text-sm text-slate-900 shadow-none focus-visible:ring-2 focus-visible:ring-blue-500/40 data-placeholder:text-slate-400 dark:bg-zinc-800/70 dark:text-white";

// The API filters on a minimum duration in hours, so each option is a floor.
const DURATIONS = [
  { value: "2", label: "Short trip (2+ hrs)" },
  { value: "4", label: "Half day (4+ hrs)" },
  { value: "8", label: "Full day (8+ hrs)" },
  { value: "24", label: "Multi-day (24+ hrs)" },
];

/** Pulls one or two amounts out of free text like "$500 - $5000" or "under 200". */
export function parseBudget(input: string): { min?: number; max?: number } {
  const numbers = (input.match(/\d[\d,]*/g) ?? [])
    .map((n) => Number(n.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);

  if (numbers.length === 0) return {};
  if (numbers.length === 1) return { max: numbers[0] };
  const sorted = [...numbers].sort((a, b) => a - b);
  return { min: sorted[0], max: sorted[sorted.length - 1] };
}

export default function PlanTripForm({
  categories,
  cities,
}: {
  categories: string[];
  cities: string[];
}) {
  const router = useRouter();
  const listId = useId();

  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    // A destination that names a city we actually run tours in becomes a city
    // filter; anything else falls back to a free-text search.
    const typed = destination.trim();
    const matchedCity = cities.find((c) => c.toLowerCase() === typed.toLowerCase());
    if (matchedCity) params.set("city", matchedCity);
    else if (typed) params.set("search", typed);

    const extra = notes.trim();
    if (extra && !params.has("search")) params.set("search", extra);

    if (category && category !== "all") params.set("category", category);
    if (duration && duration !== "any") params.set("duration", duration);
    if (guests) params.set("guests", guests);

    const { min, max } = parseBudget(budget);
    if (min !== undefined) params.set("minPrice", String(min));
    if (max !== undefined) params.set("maxPrice", String(max));

    router.push(`/explore?${params}`);
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-950/5 sm:p-8 dark:bg-zinc-900"
    >
      <label htmlFor="plan-destination" className={labelClass}>
        Destination
      </label>
      <input
        id="plan-destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Enter your dream destination (e.g., Sylhet, Dhaka, Paris)"
        className={fieldClass}
        list={listId}
        autoComplete="off"
      />
      <datalist id={listId}>
        {cities.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <span className={labelClass}>Discover Your Travel Style</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={selectClass} aria-label="Travel style">
              <SelectValue placeholder="e.g., Adventure, Cultural" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any style</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c.charAt(0) + c.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <span className={labelClass}>Trip Duration</span>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className={selectClass} aria-label="Trip duration">
              <SelectValue placeholder="Any length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any length</SelectItem>
              {DURATIONS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <span className={labelClass}>Travellers</span>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className={selectClass} aria-label="Travellers">
              <SelectValue placeholder="How many people?" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((g) => (
                <SelectItem key={g} value={String(g)}>
                  {g} {g > 1 ? "people" : "person"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="plan-budget" className={labelClass}>
            Plan Your Budget
          </label>
          <input
            id="plan-budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="(e.g., $50 - $500)"
            inputMode="numeric"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="plan-notes" className={labelClass}>
          Additional Information
        </label>
        <textarea
          id="plan-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
          placeholder="Enter any additional notes or preferences here..."
          className="w-full resize-none rounded-xl border-0 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none ring-blue-500/40 transition placeholder:text-slate-400 focus:ring-2 dark:bg-zinc-800/70 dark:text-white dark:placeholder:text-zinc-500"
        />
      </div>

      <button
        type="submit"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Find My Perfect Trip
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
