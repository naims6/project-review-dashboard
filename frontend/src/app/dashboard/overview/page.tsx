import { getMe } from "@/lib/api/get-me";
import { OverviewView } from "@/components/dashboard/overview/OverviewView";

export default async function OverviewPage() {
  const user = await getMe();
  return <OverviewView user={user} />;
}
