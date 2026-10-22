"use client";

import { useState, useEffect, useCallback } from "react";
import type { User as AuthUser } from "@/types/auth";
import type { StudentProjectItem } from "@/types/project";
import { getMyProjects } from "@/services/project.service";
import { SubmitProjectModal } from "./SubmitProjectModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
} from "lucide-react";
import type { ProjectStatus } from "@/types/project";

interface StudentDashboardViewProps {
  user: AuthUser;
}

// ── Status badge helper ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    APPROVED:
      "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    REJECTED: "border-rose-500/30 text-rose-400 bg-rose-500/10",
    PENDING: "border-amber-500/30 text-amber-400 bg-amber-500/10",
  };
  const icons: Record<ProjectStatus, React.ReactNode> = {
    APPROVED: <CheckCircle2 className="w-3 h-3" />,
    REJECTED: <XCircle className="w-3 h-3" />,
    PENDING: <Clock className="w-3 h-3" />,
  };

  return (
    <Badge
      variant="outline"
      className={`text-[10px] gap-1 ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </Badge>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function StudentDashboardView({ user }: StudentDashboardViewProps) {
  const [projects, setProjects] = useState<StudentProjectItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch student's own projects
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getMyProjects({ page, limit: 10 });
      setProjects(res.data || []);
      setTotal(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to load your projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Derived counts for stat cards
  const pending = projects.filter((p) => p.status === "PENDING").length;
  const approved = projects.filter((p) => p.status === "APPROVED").length;
  const rejected = projects.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
            My Projects
          </h1>
          <p className="text-xs text-white/50">
            Welcome, {user.name}. Submit projects and track your review status.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          Submit Project
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: total,
            color: "text-white",
            icon: <FolderGit2 className="w-4 h-4 text-violet-400" />,
            border: "border-white/[0.08] bg-white/[0.02]",
          },
          {
            label: "Pending",
            value: pending,
            color: "text-amber-400",
            icon: <Clock className="w-4 h-4 text-amber-400" />,
            border: "border-amber-500/20 bg-amber-500/[0.03]",
          },
          {
            label: "Approved",
            value: approved,
            color: "text-emerald-400",
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
            border: "border-emerald-500/20 bg-emerald-500/[0.03]",
          },
          {
            label: "Rejected",
            value: rejected,
            color: "text-rose-400",
            icon: <XCircle className="w-4 h-4 text-rose-400" />,
            border: "border-rose-500/20 bg-rose-500/[0.03]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-4 ${stat.border}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                {stat.label}
              </span>
              {stat.icon}
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>
              {isLoading ? "—" : stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Projects Table ── */}
      <div className="rounded-xl border border-white/[0.08] bg-[#111118]/80 overflow-hidden">
        <Table>
          <TableHeader className="bg-white/[0.02] border-b border-white/[0.06]">
            <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
              <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
                Project
              </TableHead>
              <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
                Links
              </TableHead>
              <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
                Status
              </TableHead>
              <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
                Submitted
              </TableHead>
              <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
                Mentor Feedback
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-white/40">
                    <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                    <span className="text-xs">Loading your projects...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-white/40">
                    <FolderGit2 className="w-8 h-8 text-white/10" />
                    <div>
                      <p className="text-sm font-medium text-white/50">
                        No projects submitted yet
                      </p>
                      <p className="text-xs mt-0.5">
                        Click{" "}
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
                        >
                          Submit Project
                        </button>{" "}
                        to get started.
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((proj) => (
                <TableRow
                  key={proj.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                >
                  {/* Project name + description */}
                  <TableCell className="py-3 px-4">
                    <p className="text-xs font-medium text-white/90">
                      {proj.name}
                    </p>
                    <p
                      className="text-[11px] text-white/40 mt-0.5 line-clamp-1 max-w-[180px]"
                      title={proj.description}
                    >
                      {proj.description}
                    </p>
                  </TableCell>

                  {/* Repo + Live links */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Repository"
                          className="text-white/40 hover:text-white transition-colors"
                        >
                          <GitBranch className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Live Demo"
                          className="text-violet-400 hover:text-violet-300 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </TableCell>

                  {/* Status badge */}
                  <TableCell className="py-3 px-4">
                    <StatusBadge status={proj.status} />
                  </TableCell>

                  {/* Submitted date */}
                  <TableCell className="py-3 px-4 text-xs text-white/40">
                    {proj.createdAt
                      ? new Date(proj.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </TableCell>

                  {/* Mentor review comment */}
                  <TableCell className="py-3 px-4">
                    {proj.reviewComment ? (
                      <div className="flex items-start gap-1.5 max-w-[220px]">
                        <MessageSquare className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        <span
                          className="text-[11px] text-white/60 line-clamp-2"
                          title={proj.reviewComment}
                        >
                          {proj.reviewComment}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-white/20 italic">
                        {proj.status === "PENDING"
                          ? "Awaiting review"
                          : "No comment"}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination footer */}
        {!isLoading && projects.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06] text-xs text-white/40">
            <div>
              Showing{" "}
              <span className="font-medium text-white/70">{projects.length}</span>{" "}
              of{" "}
              <span className="font-medium text-white/70">{total}</span>{" "}
              projects
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>

              <span className="text-xs text-white/50 px-1">
                {page} / {totalPages || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Submit project modal */}
      <SubmitProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
