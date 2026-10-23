import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMe } from "@/services/auth.service";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-3 text-white/50">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      <span className="text-xs">Loading dashboard...</span>
    </div>
  );
}

async function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  let user;
  try {
    user = await getMe();
  } catch {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#0a0a0f] text-white">
        {/* ── Left Sidebar ── */}
        <DashboardSidebar user={user} />

        {/* ── Main Content Area ── */}
        <SidebarInset className="bg-[#0a0a0f] flex flex-col flex-1 min-w-0">
          <DashboardHeader user={user} />
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
