import { getMe } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

async function DashboardContent() {
  let user;

  try {
    user = await getMe();
  } catch {
    redirect("/login");
  }

  return <DashboardShell user={user} />;
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-3 text-white/50">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      <span className="text-xs">Loading dashboard...</span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
