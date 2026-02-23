import BookingsList from "./BookingsList";
import { getCurrentUser } from "@/lib/auth";

export default async function BookingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {user.data.role === "GUIDE" ? "Assigned Bookings" : "My Bookings"}
      </h2>
      <BookingsList user={user} />
    </div>
  );
}
