import BookingsTable from "./BookingsTable";
import { getCurrentUser } from "@/lib/auth";

export default async function BookingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {user.data.role === "GUIDE"
            ? "Assigned Bookings"
            : user.data.role === "ADMIN"
              ? "All Bookings"
              : "My Bookings"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {user.data.role === "GUIDE"
            ? "Manage your upcoming tour bookings"
            : user.data.role === "ADMIN"
              ? "View and manage all platform bookings"
              : "Track your tour bookings and payments"}
        </p>
      </div>
      <BookingsTable user={user} />
    </div>
  );
}
