"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@/types/auth";
import type { MentorProjectItem, MentorStats } from "@/types/mentor";
import { getMentorStats, getMentorProjects } from "@/services/mentor.service";
import { getAdminUsers } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  ArrowRight,
  ExternalLink,
  GitBranch,
  Loader2,
  Sparkles,
} from "lucide-react";

interface OverviewViewProps {
  user: User;
}

// ── Student overview — simple welcome + how-it-works, no mentor API calls ─────

function StudentOverview({ user }: OverviewViewProps) {
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

// ── Main export — routes students away before any mentor API calls ─────────────

export function OverviewView({ user }: OverviewViewProps) {
  if (user.role === "STUDENT") {
    return <StudentOverview user={user} />;
  }
  return <MentorAdminOverview user={user} />;
}

// ── Mentor / Admin overview ───────────────────────────────────────────────────

function MentorAdminOverview({ user }: OverviewViewProps) {
  const [stats, setStats] = useState<MentorStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentProjects, setRecentProjects] = useState<MentorProjectItem[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      setIsLoading(true);
      try {
        const promises: Promise<unknown>[] = [
          getMentorStats(),
          getMentorProjects({ page: 1, limit: 4, sortOrder: "desc" }),
        ];

        if (user.role === "ADMIN") {
          promises.push(getAdminUsers({ page: 1, limit: 1 }));
        }

        const results = await Promise.all(promises);

        if (isMounted) {
          const statsRes = results[0] as MentorStats;
          const projectsRes = results[1] as { data: MentorProjectItem[] };

          setStats(statsRes);
          setRecentProjects(projectsRes.data || []);

          if (user.role === "ADMIN" && results[2]) {
            const adminRes = results[2] as { meta?: { total?: number } };
            setTotalUsers(adminRes.meta?.total || 0);
          }
        }
      } catch (err) {
        console.error("Failed to load overview data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadOverview();
    return () => {
      isMounted = false;
    };
  }, [user.role]);

  const reviewedCount = stats.approved + stats.rejected;
  const reviewProgressPercent =
    stats.total > 0 ? Math.round((reviewedCount / stats.total) * 100) : 0;
  const approvalRatePercent =
    reviewedCount > 0 ? Math.round((stats.approved / reviewedCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
            Overview
          </h1>
          <p className="text-xs text-white/50">
            Welcome back, {user.name}. Here is what is happening today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user.role === "ADMIN" && (
            <Link href="/dashboard/users">
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Users
              </Button>
            </Link>
          )}

          <Link href="/dashboard/projects">
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.1] bg-white/[0.02] text-white/80 hover:text-white hover:bg-white/[0.05] text-xs h-8 gap-1.5"
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              Projects
              <ArrowRight className="w-3 h-3 text-white/40" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.03] transition-all hover:border-violet-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Total Projects
              </span>
              <FolderGit2 className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">
                {isLoading ? "—" : stats.total}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className="border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] transition-all hover:border-amber-500/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-amber-400/80 font-medium uppercase tracking-wider">
                Pending Review
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-amber-400 tracking-tight">
                {isLoading ? "—" : stats.pending}
              </span>
              <span className="text-[11px] text-amber-400/60 font-medium">
                {stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="border-emerald-500/20 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-all hover:border-emerald-500/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-emerald-400/80 font-medium uppercase tracking-wider">
                Approved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                {isLoading ? "—" : stats.approved}
              </span>
              <span className="text-[11px] text-emerald-400/60 font-medium">
                {stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Rejected */}
        <Card className="border-rose-500/20 bg-rose-500/[0.03] hover:bg-rose-500/[0.06] transition-all hover:border-rose-500/40">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-rose-400/80 font-medium uppercase tracking-wider">
                Rejected
              </span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold text-rose-400 tracking-tight">
                {isLoading ? "—" : stats.rejected}
              </span>
              <span className="text-[11px] text-rose-400/60 font-medium">
                {stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Review Progress Bar ── */}
      {stats.total > 0 && (
        <Card className="border-white/[0.08] bg-[#111118]/80">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-white/90">Review Progress</h3>
                <p className="text-[11px] text-white/40">
                  {reviewedCount} of {stats.total} projects reviewed ({reviewProgressPercent}%)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-400">{approvalRatePercent}%</span>
                <span className="text-[11px] text-white/40 block">Approval rate</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.approved / stats.total) * 100 : 0}%` }}
                title={`Approved: ${stats.approved}`}
              />
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.rejected / stats.total) * 100 : 0}%` }}
                title={`Rejected: ${stats.rejected}`}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Recent Submissions ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Recent Projects</h2>
          <Link href="/dashboard/projects">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-white/50 hover:text-white h-7 gap-1"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="h-28 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center gap-2 text-white/40">
            <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            <span className="text-xs">Loading projects...</span>
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="h-24 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-center text-xs text-white/40">
            No projects submitted yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentProjects.map((project) => (
              <Card
                key={project.id}
                className="border-white/[0.06] bg-[#111118]/80 hover:bg-[#111118] transition-colors"
              >
                <CardContent className="p-4 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-white text-xs truncate">
                        {project.name}
                      </h3>
                      <p className="text-[11px] text-white/40 truncate mt-0.5">
                        {project.student.name} • {project.student.email}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        project.status === "APPROVED"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[9px]"
                          : project.status === "REJECTED"
                          ? "border-rose-500/30 text-rose-400 bg-rose-500/10 text-[9px]"
                          : "border-amber-500/30 text-amber-400 bg-amber-500/10 text-[9px]"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/40 hover:text-white transition-colors"
                          title="Repository"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-violet-400 hover:text-violet-300 transition-colors"
                          title="Live Demo"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      href="/dashboard/projects"
                      className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      Review →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
