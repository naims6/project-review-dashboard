import { redirect } from "next/navigation";
import { getMe } from "@/lib/api/get-me";
import { MentorDashboardView } from "@/components/dashboard/projects/MentorDashboardView";

export default async function ProjectsPage() {
  const user = await getMe();

  // Students have their own portal
  if (user.role === "STUDENT") {
    redirect("/dashboard/my-projects");
  }

  return <MentorDashboardView />;
}
