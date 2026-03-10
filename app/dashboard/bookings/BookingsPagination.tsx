"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookingPagination({
  currentPage,
  totalPages,
  onPageChange,
}: BookingPaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-full p-2 border border-zinc-300 dark:border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit transition"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-full w-10 h-10 border transition ${
            currentPage === page
              ? "bg-red-600 text-white border-red-600"
              : "border-zinc-300 dark:border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-full p-2 border border-zinc-300 dark:border-zinc-700 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-inherit transition"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
