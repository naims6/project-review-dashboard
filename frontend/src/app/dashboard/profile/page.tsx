import { getMe } from "@/lib/api/get-me";
import { ProfileView } from "@/components/dashboard/profile/ProfileView";

export default async function ProfilePage() {
  const user = await getMe();
  return <ProfileView user={user} />;
}
