"use client";

import Link from "next/link";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  ArrowRight,
  Rocket,
} from "lucide-react";

interface StudentOverviewProps {
  user: User;
}

const STEPS = [
  {
    step: "01",
    label: "Submit a Project",
    desc: "Share your GitHub repo and live demo link for review.",
    icon: FolderGit2,
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    step: "02",
    label: "Await Review",
    desc: "A mentor will evaluate your submission shortly.",
    icon: Clock,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    step: "03",
    label: "Get Feedback",
    desc: "Receive approval or rejection with detailed comments.",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function StudentOverview({ user }: StudentOverviewProps) {
  return (
    <div className="space-y-6">
      {/* ── Page heading ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-1">
          Dashboard
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Overview
        </h1>
      </div>

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-violet-950/30 via-[#0d0d14] to-[#0d0d14] p-7">
        {/* Glow blob */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400">
                Student Portal
              </p>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-1.5">
              Welcome, {user.name}!
            </h2>
            <p className="text-sm text-white/45 max-w-sm leading-relaxed">
              Submit your project for mentor review and track the status in your
              Projects tab.
            </p>
          </div>
          <Link href="/dashboard/my-projects" className="shrink-0">
            <Button className="bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs h-9 gap-1.5 shadow-lg shadow-violet-600/20">
              <Rocket className="w-3.5 h-3.5" />
              Go to My Projects
            </Button>
          </Link>
        </div>
      </div>

      {/* ── How it works ── */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-3">
          How it works
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 hover:bg-white/[0.03] hover:border-white/[0.1] transition-all group"
              >
                {/* Icon + step number */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-8 h-8 rounded-lg border flex items-center justify-center ${step.iconBg}`}
                  >
                    <Icon className={`w-4 h-4 ${step.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-bold text-white/15 tabular-nums">
                    {step.step}
                  </span>
                </div>

                {/* Text */}
                <p className="text-sm font-semibold text-white/85 mb-1">
                  {step.label}
                </p>
                <p className="text-[11px] text-white/35 leading-relaxed mb-4">
                  {step.desc}
                </p>

                {/* CTA */}
                <Link
                  href="/dashboard/my-projects"
                  className="inline-flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Open Projects
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
