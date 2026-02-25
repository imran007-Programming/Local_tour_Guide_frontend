import BookingsList from "../bookings/BookingsList";
import { getCurrentUser } from "@/lib/auth";

export default async function RequestsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pending Requests</h2>
      <BookingsList user={user} initialStatus="PENDING" />
    </div>
  );
}
