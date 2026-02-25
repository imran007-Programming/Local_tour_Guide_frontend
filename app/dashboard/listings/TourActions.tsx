"use client";

import { Pencil, Trash2 } from "lucide-react";
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

  if (!slug) {
    console.error("Tour slug is undefined");
    return null;
  }

  const handleDelete = async () => {
    setDeleting(true);
    const res = await authFetch(`${BASE_URL}/tour/${id}`, {
      method: "DELETE",
    });
    const result = await res?.json();
    if (result.error.statusCode === 400) {
      toast.error(`${result.message}`);
    }
    if (res?.ok) {
      toast.success("Tour deleted successfully");
      router.push("/dashboard/listings");
      router.refresh();
    } else {
      // toast.error("Failed to delete tour");
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => router.push(`/dashboard/listings/${slug}/edit`)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition"
        >
          <Pencil className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowDialog(true)}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Delete Tour</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete &quot;{tourTitle}&quot;? This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
