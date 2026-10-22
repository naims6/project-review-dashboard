"use client";

import type { User } from "@/types/auth";
import Link from "next/link";
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
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/LogoutButton";
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
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function DashboardSidebar({
  user,
  activeTab,
  onTabChange,
}: DashboardSidebarProps) {
  const getNavItems = (): NavItem[] => {
    const items: NavItem[] = [
      {
        id: "overview",
        label: "Overview",
        icon: LayoutDashboard,
      },
    ];

    if (user.role === "ADMIN") {
      items.push(
        {
          id: "users",
          label: "Users",
          icon: Users,
        },
        {
          id: "projects",
          label: "Projects",
          icon: FolderGit2,
        },
      );
    } else if (user.role === "MENTOR") {
      items.push({
        id: "projects",
        label: "Projects",
        icon: FolderGit2,
      });
    } else {
      items.push({
        id: "projects",
        label: "My Projects",
        icon: FolderGit2,
      });
    }

    items.push({
      id: "profile",
      label: "Profile",
      icon: UserCircle2,
    });

    return items;
  };

  const navItems = getNavItems();

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "border-violet-500/40 text-violet-300 bg-violet-500/10";
      case "MENTOR":
        return "border-cyan-500/40 text-cyan-300 bg-cyan-500/10";
      default:
        return "border-emerald-500/40 text-emerald-300 bg-emerald-500/10";
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/[0.06] bg-[#0a0a0f] text-white"
    >
      {/* ── Brand Header (Matching Navbar logo) ── */}
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
                const isActive = activeTab === item.id;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onTabChange(item.id)}
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
              <Badge
                variant="outline"
                className={`mt-1 text-[9px] uppercase font-bold tracking-wider py-0 px-1.5 ${getRoleBadgeStyle(
                  user.role,
                )}`}
              >
                {user.role}
              </Badge>
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
