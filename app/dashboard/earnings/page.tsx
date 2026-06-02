import { getCurrentUser } from "@/lib/auth";
import EarningsList from "./EarningsList";

export default async function EarningsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Earnings</h2>
      <EarningsList user={user} />
    </div>
  );
}
