import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.service";
import { StudentDashboardView } from "@/components/dashboard/StudentDashboardView";

/** /dashboard/my-projects — Students only */
export default async function MyProjectsPage() {
  const user = await getMe();

  // Non-students have no business here — send them to the review board
  if (user.role !== "STUDENT") {
    redirect("/dashboard/projects");
  }

  return <StudentDashboardView user={user} />;
}
