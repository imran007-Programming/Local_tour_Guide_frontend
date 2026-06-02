import { getCurrentUser } from "@/lib/auth";
import SettingsContent from "./SettingsContent";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <SettingsContent user={user} />
    </div>
  );
}
