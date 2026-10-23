"use client";

import Link from "next/link";
import type { User } from "@/types/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface StudentOverviewProps {
  user: User;
}

export function StudentOverview({ user }: StudentOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.06]">
        <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
          Overview
        </h1>
        <p className="text-xs text-white/50">
          Welcome back, {user.name}. Ready to submit or track your projects?
        </p>
      </div>

      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/40 via-violet-900/20 to-transparent border border-violet-500/20 p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold">
                Student Portal
              </p>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Welcome, {user.name}!
            </h2>
            <p className="text-sm text-white/50 max-w-md">
              Submit your project for mentor review. Track status and read
              feedback in the Projects tab.
            </p>
          </div>
          <Link href="/dashboard/my-projects">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs h-9 gap-1.5 shadow-lg shadow-violet-600/20 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              Go to My Projects
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* How-it-works cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "1. Submit a Project",
            desc: "Share your GitHub repo and live demo link",
            icon: <FolderGit2 className="w-5 h-5 text-violet-400" />,
          },
          {
            label: "2. Await Review",
            desc: "A mentor will evaluate your submission shortly",
            icon: <Clock className="w-5 h-5 text-amber-400" />,
          },
          {
            label: "3. Get Feedback",
            desc: "Receive approval or rejection with detailed comments",
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
          },
        ].map((step) => (
          <Card
            key={step.label}
            className="border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.03] transition-all"
          >
            <CardContent className="p-5 flex flex-col gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">{step.label}</p>
                <p className="text-xs text-white/40 mt-0.5">{step.desc}</p>
              </div>
              <Link
                href="/dashboard/my-projects"
                className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
              >
                Open Projects <ArrowRight className="w-3 h-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
