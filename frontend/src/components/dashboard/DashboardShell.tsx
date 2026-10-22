"use client";

import { useState } from "react";
import type { User } from "@/types/auth";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { OverviewView } from "./OverviewView";
import { AdminDashboardView } from "./AdminDashboardView";
import { MentorDashboardView } from "./MentorDashboardView";
import { StudentDashboardView } from "./StudentDashboardView";
import { ProfileView } from "./ProfileView";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

interface DashboardShellProps {
  user: User;
}

export function DashboardShell({ user }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getSectionTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Overview";
      case "users":
        return "Users";
      case "projects":
        return "Projects";
      case "profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-[#0a0a0f] text-white">
        {/* ── Left Sidebar ── */}
        <DashboardSidebar
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ── Main Inset Content Area ── */}
        <SidebarInset className="bg-[#0a0a0f] flex flex-col flex-1 min-w-0">
          {/* Top Header */}
          <header className="h-16 shrink-0 border-b border-white/[0.06] bg-[#0c0c14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-white/60 hover:text-white hover:bg-white/[0.06] -ml-2" />
              <Separator orientation="vertical" className="h-4 bg-white/[0.1]" />

              {/* Breadcrumb Path */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/40 hover:text-white/70 transition-colors cursor-pointer" onClick={() => setActiveTab("overview")}>
                  Dashboard
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                <span className="font-semibold text-white/90">
                  {getSectionTitle()}
                </span>
              </div>
            </div>

            {/* Quick User State */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 font-medium">{user.name}</span>
                <span className="text-white/20">|</span>
                <Badge
                  variant="outline"
                  className={
                    user.role === "ADMIN"
                      ? "border-violet-500/40 text-violet-300 bg-violet-500/10 text-[9px] uppercase font-bold"
                      : user.role === "MENTOR"
                      ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10 text-[9px] uppercase font-bold"
                      : "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 text-[9px] uppercase font-bold"
                  }
                >
                  {user.role}
                </Badge>
              </div>
            </div>
          </header>

          {/* Dynamic Main Workspace */}
          <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {activeTab === "overview" && (
              <OverviewView user={user} onNavigateTab={setActiveTab} />
            )}

            {activeTab === "users" && <AdminDashboardView />}

            {activeTab === "projects" &&
              (user.role === "STUDENT" ? (
                <StudentDashboardView user={user} />
              ) : (
                <MentorDashboardView />
              ))}

            {activeTab === "profile" && <ProfileView user={user} />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
