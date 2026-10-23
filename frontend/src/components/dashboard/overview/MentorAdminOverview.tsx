"use client";

import { formatDate } from "@/lib/formatDate";
import Link from "next/link";
import type { User } from "@/types/auth";
import {
  useMentorStats,
  useMentorProjects,
} from "@/hooks/queries/use-mentor-queries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
} from "lucide-react";

interface MentorAdminOverviewProps {
  user: User;
}

export function MentorAdminOverview({ user }: MentorAdminOverviewProps) {
  const { data: stats, isLoading: statsLoading } = useMentorStats();
  const { data: projectsData, isLoading: projectsLoading } = useMentorProjects({
    page: 1,
    limit: 4,
    sortOrder: "desc",
  });

  const statsData = stats ?? { total: 0, pending: 0, approved: 0, rejected: 0 };
  const recentProjects = projectsData?.data ?? [];
  const isLoading = statsLoading || projectsLoading;

  const reviewedCount = statsData.approved + statsData.rejected;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
            Overview
          </h1>
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
                {isLoading ? "—" : statsData.total}
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
                {isLoading ? "—" : statsData.pending}
              </span>
              <span className="text-[11px] text-amber-400/60 font-medium">
                {statsData.total > 0
                  ? Math.round((statsData.pending / statsData.total) * 100)
                  : 0}
                %
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
                {isLoading ? "—" : statsData.approved}
              </span>
              <span className="text-[11px] text-emerald-400/60 font-medium">
                {statsData.total > 0
                  ? Math.round((statsData.approved / statsData.total) * 100)
                  : 0}
                %
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
                {isLoading ? "—" : statsData.rejected}
              </span>
              <span className="text-[11px] text-rose-400/60 font-medium">
                {statsData.total > 0
                  ? Math.round((statsData.rejected / statsData.total) * 100)
                  : 0}
                %
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Review Progress ── */}
      {statsData.total > 0 && (
        <Card className="border-white/[0.08] bg-[#111118]/80">
          <CardContent className="p-5 space-y-4">
            {/* Title row */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/90">
                Review Progress
              </h3>
              <span className="text-[11px] text-white/40">
                {reviewedCount} / {statsData.total} reviewed
              </span>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden flex gap-px">
              {statsData.approved > 0 && (
                <div
                  className="h-full bg-emerald-500 rounded-l-full transition-all duration-700"
                  style={{
                    width: `${(statsData.approved / statsData.total) * 100}%`,
                  }}
                />
              )}
              {statsData.pending > 0 && (
                <div
                  className="h-full bg-amber-400 transition-all duration-700"
                  style={{
                    width: `${(statsData.pending / statsData.total) * 100}%`,
                  }}
                />
              )}
              {statsData.rejected > 0 && (
                <div
                  className="h-full bg-rose-500 rounded-r-full transition-all duration-700"
                  style={{
                    width: `${(statsData.rejected / statsData.total) * 100}%`,
                  }}
                />
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] text-white/50">
                  Approved{" "}
                  <span className="text-white/80 font-medium">
                    {statsData.approved}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[11px] text-white/50">
                  Pending{" "}
                  <span className="text-white/80 font-medium">
                    {statsData.pending}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[11px] text-white/50">
                  Rejected{" "}
                  <span className="text-white/80 font-medium">
                    {statsData.rejected}
                  </span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Recent Projects ── */}
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
          <div className="rounded-xl border border-white/[0.06] bg-[#111118]/80 overflow-hidden">
            {recentProjects.map((project, index) => (
              <div
                key={project.id}
                className={`flex items-center gap-4 px-4 py-3.5 hover:bg-white/[0.03] transition-colors ${
                  index !== recentProjects.length - 1
                    ? "border-b border-white/[0.04]"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">
                    {project.name}
                  </p>
                  <p className="text-[11px] text-white/40 truncate mt-0.5">
                    {project.student.name}
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-2 shrink-0">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Repository"
                      className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Live Demo"
                      className="w-6 h-6 flex items-center justify-center rounded-md text-white/30 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Status */}
                <StatusBadge
                  status={project.status}
                  className="text-[10px] shrink-0"
                />

                {/* Date */}
                <span className="text-[11px] text-white/30 shrink-0 hidden sm:block">
                  {formatDate(project.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
