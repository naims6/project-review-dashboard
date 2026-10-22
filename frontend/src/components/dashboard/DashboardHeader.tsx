"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { User } from "@/types/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  user: User;
}

const SEGMENT_LABELS: Record<string, string> = {
  overview: "Overview",
  "my-projects": "My Projects",
  projects: "Projects",
  users: "Users",
  profile: "Profile",
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  // e.g. /dashboard/my-projects → "my-projects"
  const segment = pathname.split("/").pop() ?? "overview";
  const sectionTitle = SEGMENT_LABELS[segment] ?? "Dashboard";

  const roleBadgeClass =
    user.role === "ADMIN"
      ? "border-violet-500/40 text-violet-300 bg-violet-500/10 text-[9px] uppercase font-bold"
      : user.role === "MENTOR"
      ? "border-cyan-500/40 text-cyan-300 bg-cyan-500/10 text-[9px] uppercase font-bold"
      : "border-emerald-500/40 text-emerald-300 bg-emerald-500/10 text-[9px] uppercase font-bold";

  return (
    <header className="h-16 shrink-0 border-b border-white/[0.06] bg-[#0c0c14]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-white/60 hover:text-white hover:bg-white/[0.06] -ml-2" />
        <Separator orientation="vertical" className="h-4 bg-white/[0.1]" />

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/dashboard/overview"
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-white/30" />
          <span className="font-semibold text-white/90">{sectionTitle}</span>
        </div>
      </div>

      {/* User pill */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white/80 font-medium">{user.name}</span>
        <span className="text-white/20">|</span>
        <Badge variant="outline" className={roleBadgeClass}>
          {user.role}
        </Badge>
      </div>
    </header>
  );
}
