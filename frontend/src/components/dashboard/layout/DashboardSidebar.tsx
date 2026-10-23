"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { User } from "@/types/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { RoleBadge } from "@/components/shared/RoleBadge";
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  UserCircle2,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

interface DashboardSidebarProps {
  user: User;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function getNavItems(role: User["role"]): NavItem[] {
  const items: NavItem[] = [
    { label: "Overview", href: "/dashboard/overview", icon: LayoutDashboard },
  ];

  if (role === "ADMIN") {
    items.push(
      { label: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
      { label: "Users", href: "/dashboard/users", icon: Users },
    );
  } else if (role === "MENTOR") {
    items.push({ label: "Projects", href: "/dashboard/projects", icon: FolderGit2 });
  } else {
    // STUDENT
    items.push({ label: "My Projects", href: "/dashboard/my-projects", icon: FolderGit2 });
  }

  items.push({ label: "Profile", href: "/dashboard/profile", icon: UserCircle2 });

  return items;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const navItems = getNavItems(user.role);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/[0.06] bg-[#0a0a0f] text-white"
    >
      {/* ── Brand Header ── */}
      <SidebarHeader className="border-b border-white/[0.06] h-14 px-5 flex items-center justify-center">
        <div className="flex items-center w-full">
          <Link
            href="/"
            className="text-[15px] font-semibold tracking-tight text-white truncate"
          >
            Project<span className="text-violet-400">Hub</span>
          </Link>
        </div>
      </SidebarHeader>

      {/* ── Navigation Menu ── */}
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={`w-full justify-start gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-violet-600 text-white font-semibold shadow-lg shadow-violet-600/25 ring-1 ring-violet-400/30"
                          : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? "text-white" : "text-white/50"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User Profile Footer ── */}
      <SidebarFooter className="border-t border-white/[0.06] p-3">
        <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0">
              {user.role === "ADMIN" ? (
                <ShieldCheck className="w-4 h-4 text-violet-400" />
              ) : user.role === "MENTOR" ? (
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              ) : (
                <GraduationCap className="w-4 h-4 text-emerald-400" />
              )}
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-semibold text-white/90 truncate leading-tight">
                {user.name}
              </p>
              <RoleBadge role={user.role} className="mt-1 text-[9px] py-0 px-1.5" />
            </div>
          </div>

          <div className="group-data-[collapsible=icon]:hidden">
            <LogoutButton />
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
