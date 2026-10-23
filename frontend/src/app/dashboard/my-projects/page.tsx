import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/get-me";
import { StudentDashboardView } from "@/components/dashboard/my-projects/StudentDashboardView";

export default async function MyProjectsPage() {
  const user = await getMe();

  // Non-students have no business here — send them to the review board
  if (user.role !== "STUDENT") {
    redirect("/dashboard/projects");
  }

  return <StudentDashboardView user={user} />;
}
