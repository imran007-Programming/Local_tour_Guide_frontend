import { getCurrentUser } from "@/lib/auth";
import WishlistContent from "./WishlistContent";

export default async function WishlistPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Wishlist</h2>
      <WishlistContent user={user} />
    </div>
  );
}
