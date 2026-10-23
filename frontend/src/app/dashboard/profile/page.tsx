import { getMe } from "@/services/auth.service";
import { ProfileView } from "@/components/dashboard/profile/ProfileView";

export default async function ProfilePage() {
  const user = await getMe();
  return <ProfileView user={user} />;
}
