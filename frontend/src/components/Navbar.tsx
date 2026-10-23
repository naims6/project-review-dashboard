"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import type { User } from "@/types/auth";
import { Logo } from "@/components/shared/Logo";
import { logout } from "@/services/auth.service";
import { UserCircle2, LayoutDashboard, LogOut } from "lucide-react";

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Logo />

          {user ? (
            /* ── Authenticated ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                aria-label="User menu"
                className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.10] hover:border-violet-500/40 transition-all"
              >
                <UserCircle2 className="w-5 h-5" />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/[0.08] bg-[#0f0f1a] shadow-xl shadow-black/40 overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-xs font-semibold text-white/90 truncate">{user.name}</p>
                    <p className="text-[10px] text-white/40 truncate mt-0.5">{user.email}</p>
                  </div>

                  {/* Go to Dashboard */}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-violet-400" />
                    Dashboard
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
          ) : (
            /* ── Guest ── */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-[13px] font-medium text-white/50 hover:text-white transition-colors px-3 py-1.5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-[13px] font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
