import { redirect } from "next/navigation";
import { getMe } from "@/services/auth.service";
import { MentorDashboardView } from "@/components/dashboard/projects/MentorDashboardView";

/** /dashboard/projects — Mentors and Admins only */
export default async function ProjectsPage() {
  const user = await getMe();

  // Students have their own portal
  if (user.role === "STUDENT") {
    redirect("/dashboard/my-projects");
  }

  return <MentorDashboardView />;
}
