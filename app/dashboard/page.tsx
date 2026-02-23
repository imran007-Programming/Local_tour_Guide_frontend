import DashboardHome from "./components/DashboardHome";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  return <DashboardHome user={user} />;
}
