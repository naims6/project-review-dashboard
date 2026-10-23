"use client";

import type { User } from "@/types/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserCircle2, Mail, ShieldCheck, Calendar } from "lucide-react";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { formatDate } from "@/lib/formatDate";

interface ProfileViewProps {
  user: User;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function ProfileView({ user }: ProfileViewProps) {
  const memberSince =
    formatDate(user.createdAt) === "—" ? "Recently" : formatDate(user.createdAt);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Page heading ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-1">
          Account
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Profile</h1>
        <p className="text-xs text-white/40 mt-1">
          Your personal account information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ── Left card — avatar ── */}
        <Card className="border-white/[0.07] bg-[#0d0d14] flex flex-col items-center text-center p-7 justify-center gap-1">
          {/* Initials avatar */}
          <div className="w-20 h-20 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mb-4 shadow-[0_0_24px_-6px_rgba(139,92,246,0.35)]">
            <span className="text-2xl font-bold tracking-tight text-violet-300">
              {getInitials(user.name)}
            </span>
          </div>
          <h2 className="text-base font-bold text-white">{user.name}</h2>
          <p className="text-xs text-white/35 font-mono mb-3">{user.email}</p>
          <RoleBadge role={user.role} className="text-[10px] px-3 py-1" />
        </Card>

        {/* ── Right card — details ── */}
        <Card className="md:col-span-2 border-white/[0.07] bg-[#0d0d14]">
          <CardHeader className="pb-3 border-b border-white/[0.06]">
            <CardTitle className="text-sm font-semibold text-white">
              Account Details
            </CardTitle>
            <CardDescription className="text-xs text-white/40">
              Personal and system information
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-2.5 text-xs">
            {[
              {
                icon: <UserCircle2 className="w-4 h-4 text-violet-400" />,
                label: "Full Name",
                value: user.name,
                mono: false,
              },
              {
                icon: <Mail className="w-4 h-4 text-violet-400" />,
                label: "Email Address",
                value: user.email,
                mono: true,
              },
              {
                icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
                label: "Assigned Role",
                value: user.role,
                mono: false,
                badge: <RoleBadge role={user.role} className="text-[9px] px-2 py-0.5" />,
              },
              {
                icon: <Calendar className="w-4 h-4 text-violet-400" />,
                label: "Member Since",
                value: memberSince,
                mono: false,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                    {row.icon}
                  </div>
                  <div>
                    <span className="text-white/30 block text-[10px] uppercase tracking-wide font-medium mb-0.5">
                      {row.label}
                    </span>
                    <span className={`font-medium text-white/85 ${row.mono ? "font-mono" : ""}`}>
                      {row.value}
                    </span>
                  </div>
                </div>
                {row.badge && row.badge}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
