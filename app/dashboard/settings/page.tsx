import { getCurrentUser } from "@/lib/auth";
import SettingsContent from "./SettingsContent";

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Settings
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your account preferences and configurations
        </p>
      </div>
      <SettingsContent user={user} />
    </div>
  );
}
