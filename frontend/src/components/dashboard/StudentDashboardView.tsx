"use client";

import type { User as AuthUser } from "@/types/auth";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShieldCheck,
  Calendar,
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface StudentDashboardViewProps {
  user: AuthUser;
}

export function StudentDashboardView({ user }: StudentDashboardViewProps) {
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="space-y-8">
      {/* ── Welcome Section ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/40 via-violet-900/20 to-transparent border border-violet-500/20 p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
                Student Workspace
              </p>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm text-white/50 max-w-xl">
              Track your assignment progress, view mentor review feedback, and maintain your project portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs h-9 gap-1.5 shadow-lg shadow-violet-600/20">
                <Sparkles className="w-3.5 h-3.5" />
                Active Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-white/[0.08] bg-white/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Submitted Projects
              </span>
              <FolderGit2 className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-white">1</p>
            <p className="text-xs text-white/30 mt-1">Portfolio active</p>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-400/60 font-medium uppercase tracking-wider">
                Under Review
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400">0</p>
            <p className="text-xs text-amber-400/40 mt-1">Waiting for mentor feedback</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-400/60 font-medium uppercase tracking-wider">
                Approved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">1</p>
            <p className="text-xs text-emerald-400/40 mt-1">Passed all requirements</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Account Details Card ── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#111118] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white">Student Profile Details</h2>
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
            Enrolled Student
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <User className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <p className="text-xs text-white/30">Full Name</p>
              <p className="font-medium text-white/90">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <p className="text-xs text-white/30">Email Address</p>
              <p className="font-medium text-white/90">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs text-white/30">Account Role</p>
              <p className="font-medium text-white/90">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <p className="text-xs text-white/30">Enrollment Date</p>
              <p className="font-medium text-white/90">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
