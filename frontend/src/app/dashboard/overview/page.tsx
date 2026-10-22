import { getMe } from "@/services/auth.service";
import { OverviewView } from "@/components/dashboard/OverviewView";

export default async function OverviewPage() {
  const user = await getMe();
  return <OverviewView user={user} />;
}
