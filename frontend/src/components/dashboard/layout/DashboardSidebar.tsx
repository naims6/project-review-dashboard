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
import { Logo } from "@/components/shared/Logo";
import { LayoutDashboard, Users, FolderGit2, Home } from "lucide-react";

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
    items.push({
      label: "Projects",
      href: "/dashboard/projects",
      icon: FolderGit2,
    });
  } else {
    // STUDENT
    items.push({
      label: "My Projects",
      href: "/dashboard/my-projects",
      icon: FolderGit2,
    });
  }

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
          <Logo />
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

      {/* ── Footer ── */}
      <SidebarFooter className="border-t border-white/[0.06] p-3 gap-3">
        {/* Back to Home button */}
        <SidebarMenuButton
          render={<Link href="/" />}
          tooltip="Back to Home"
          className="w-full justify-start gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.05] transition-all"
        >
          <Home className="w-4 h-4 shrink-0 text-white/50" />
          <span className="truncate">Back to Home</span>
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
