"use client";

import type { User } from "@/types/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle2, Mail, ShieldCheck, Calendar } from "lucide-react";

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white mb-1">
          Profile
        </h1>
        <p className="text-xs text-white/50">
          Your personal account information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Left */}
        <Card className="border-white/[0.08] bg-[#111118]/80 flex flex-col items-center text-center p-6 justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/30 to-purple-600/10 border border-violet-500/30 flex items-center justify-center mb-4">
            <UserCircle2 className="w-10 h-10 text-violet-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-0.5">{user.name}</h2>
          <p className="text-xs text-white/40 font-mono mb-3">{user.email}</p>
          <Badge
            variant="outline"
            className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1 ${getRoleBadgeStyle(
              user.role,
            )}`}
          >
            {user.role}
          </Badge>
        </Card>

        {/* Detailed Info Right */}
        <Card className="md:col-span-2 border-white/[0.08] bg-[#111118]/80">
          <CardHeader className="pb-3 border-b border-white/[0.06]">
            <CardTitle className="text-sm font-semibold text-white">
              Account Details
            </CardTitle>
            <CardDescription className="text-xs text-white/50">
              Personal and system information
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <UserCircle2 className="w-4 h-4 text-violet-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Full Name</span>
                  <span className="font-medium text-white/90">{user.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-violet-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Email Address</span>
                  <span className="font-medium text-white/90 font-mono">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Assigned Role</span>
                  <span className="font-medium text-white/90">{user.role}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-[9px] uppercase font-bold px-2 py-0.5 ${getRoleBadgeStyle(
                  user.role,
                )}`}
              >
                {user.role}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-violet-400" />
                <div>
                  <span className="text-white/40 block text-[10px]">Member Since</span>
                  <span className="font-medium text-white/90">{formattedDate}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
