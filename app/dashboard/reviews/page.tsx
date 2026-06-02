"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/authFetch";
import { BASE_URL } from "@/lib/config";
import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

interface TouristReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  guide: {
    user: {
      name: string;
      profilePic: string | null;
    };
  };
  booking: {
    tour: {
      title: string;
    };
  };
}

interface GuideReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  tourist: {
    user: {
      name: string;
      profilePic: string | null;
    };
  };
  booking: {
    tour: {
      title: string;
    };
  };
}

interface GuideData {
  id: string;
  guide: {
    id: string;
  };
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<(TouristReview | GuideReview)[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const userRes = await authFetch(`${BASE_URL}/auth/me`);
        if (userRes?.ok) {
          const userData = await userRes.json();
          const role = userData.data.role;
          const userId = userData.data.id;
          setUserRole(role);

          let res;
          if (role === "TOURIST") {
            res = await authFetch(`${BASE_URL}/reviews/me`);
          } else if (role === "GUIDE") {
            // Fetch all guides and find current user's guide profile
            const guidesRes = await fetch(`${BASE_URL}/guides`);
            if (guidesRes?.ok) {
              const guidesData = await guidesRes.json();
              const currentGuide = guidesData.data.find(
                (g: GuideData) => g.id === userId,
              );

              if (currentGuide?.guide?.id) {
                res = await fetch(
                  `${BASE_URL}/reviews/guide/${currentGuide.guide.id}`,
                );
              }
            }
          }

          if (res?.ok) {
            const result = await res.json();
            setReviews(result.data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    toast(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete this review?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                const res = await authFetch(`${BASE_URL}/reviews/${id}`, {
                  method: "DELETE",
                });

                if (res?.ok) {
                  setReviews(reviews.filter((r) => r.id !== id));
                  toast.success("Review deleted successfully");
                } else {
                  toast.error("Failed to delete review");
                }
              } catch (error) {
                toast.error("Something went wrong");
              }
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-300 text-black px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      { duration: 5000 },
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" className="text-red-500" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {userRole === "GUIDE" ? "Reviews About Me" : "My Reviews"}
      </h2>

      {reviews.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-center py-10">
            {userRole === "GUIDE"
              ? "No reviews yet"
              : "You haven&apos;t written any reviews yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {review.booking.tour.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {userRole === "TOURIST" && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>

              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={
                      userRole === "GUIDE"
                        ? (review as GuideReview).tourist.user.profilePic ||
                          "/avatar.png"
                        : (review as TouristReview).guide.user.profilePic ||
                          "/avatar.png"
                    }
                    alt={
                      userRole === "GUIDE"
                        ? (review as GuideReview).tourist.user.name
                        : (review as TouristReview).guide.user.name
                    }
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {userRole === "GUIDE"
                      ? `Tourist: ${(review as GuideReview).tourist.user.name}`
                      : `Guide: ${(review as TouristReview).guide.user.name}`}
                  </p>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
