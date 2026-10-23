"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/types/auth";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, LogOut, User as UserIcon } from "lucide-react";
import { logout } from "@/services/auth.service";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const segment = pathname.split("/").pop() ?? "overview";
  const sectionTitle = SEGMENT_LABELS[segment] ?? "Dashboard";

  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

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

      {/* User icon with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label="User menu"
          className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 hover:bg-violet-600/30 hover:border-violet-400/50 transition-all text-[11px] font-bold tracking-wide"
        >
          {getInitials(user.name)}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/[0.08] bg-[#0f0f1a] shadow-xl shadow-black/40 overflow-hidden z-50">
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white/90 truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate mt-0.5">{user.email}</p>
            </div>

            {/* Profile link */}
            <Link
              href="/dashboard/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <UserIcon className="w-3.5 h-3.5 text-violet-400" />
              Profile
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
