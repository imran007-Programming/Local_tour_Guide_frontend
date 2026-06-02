import { getCurrentUser } from "@/lib/auth";
import ProfileForm from "../components/ProfileForm";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <div className="max-w-6xl w-full mx-auto">
      <ProfileForm user={user} />
    </div>
  );
}
