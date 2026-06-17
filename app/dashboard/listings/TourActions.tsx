"use client";

import { Pencil, Trash2, Loader2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import { toast } from "sonner";

export default function TourActions({
  id,
  slug,
  tourTitle,
}: {
  id: string;
  slug: string;
  tourTitle: string;
}) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!slug) return null;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await authFetch(`${BASE_URL}/tour/${id}`, { method: "DELETE" });
      const result = await res?.json();
      if (result?.error?.statusCode === 400) {
        toast.error(result.message);
        setDeleting(false);
        return;
      }
      if (res?.ok) {
        toast.success("Tour deleted successfully");
        router.push("/dashboard/listings");
        router.refresh();
      } else {
        toast.error("Failed to delete tour");
        setDeleting(false);
      }
    } catch {
      toast.error("Something went wrong");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => router.push(`/dashboard/listings/${slug}/edit`)}
          className="p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
          title="Edit"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setShowDialog(true)}
          className="p-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete Tour
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Are you sure you want to delete &quot;{tourTitle}&quot;? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowDialog(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
