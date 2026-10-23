import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.service";
import { AdminDashboardView } from "@/components/dashboard/users/AdminDashboardView";

export default async function UsersPage() {
  const user = await getMe();

  if (user.role !== "ADMIN") {
    redirect("/dashboard/overview");
  }

  return <AdminDashboardView />;
}
