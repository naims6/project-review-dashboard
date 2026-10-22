import { redirect } from "next/navigation";

/** /dashboard → /dashboard/overview */
export default function DashboardPage() {
  redirect("/dashboard/overview");
}
