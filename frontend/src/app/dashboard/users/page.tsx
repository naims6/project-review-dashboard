import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/get-me";
import { AdminDashboardView } from "@/components/dashboard/users/AdminDashboardView";

export default async function UsersPage() {
  const user = await getMe();

  if (user.role !== "ADMIN") {
    redirect("/dashboard/overview");
  }

  return <AdminDashboardView />;
}
