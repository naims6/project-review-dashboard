"use client";

import type { StudentProjectItem, ProjectStatus } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

interface StudentProjectsTableProps {
  projects: StudentProjectItem[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onOpenSubmitModal: () => void;
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    APPROVED: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
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

export function StudentProjectsTable({
  projects,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
  onOpenSubmitModal,
}: StudentProjectsTableProps) {
  return (
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
                        onClick={onOpenSubmitModal}
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
              onClick={() => onPageChange(Math.max(1, page - 1))}
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
              onClick={() => onPageChange(page + 1)}
              className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
