"use client";

import type { MentorProjectItem, ProjectStatus } from "@/types/mentor";
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
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface ProjectsTableProps {
  projects: MentorProjectItem[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  search: string;
  onPageChange: (newPage: number) => void;
  onOpenReview: (project: MentorProjectItem) => void;
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 text-[10px] gap-1"
        >
          <CheckCircle2 className="w-3 h-3" />
          Approved
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="border-rose-500/30 text-rose-400 bg-rose-500/10 text-[10px] gap-1"
        >
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-400 bg-amber-500/10 text-[10px] gap-1"
        >
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
  }
}

export function ProjectsTable({
  projects,
  isLoading,
  total,
  page,
  totalPages,
  search,
  onPageChange,
  onOpenReview,
}: ProjectsTableProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111118]/80 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02] border-b border-white/[0.06]">
          <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Project
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Student
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Links
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Status
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Date
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4 text-right">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-36 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-white/40">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <span className="text-xs">Loading projects...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-xs text-white/40">
                {search ? `No projects matching "${search}"` : "No projects found"}
              </TableCell>
            </TableRow>
          ) : (
            projects.map((proj) => (
              <TableRow
                key={proj.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="py-3 px-4 text-xs font-medium text-white/90">
                  {proj.name}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <div className="text-xs text-white/80">{proj.student.name}</div>
                  <div className="text-[11px] text-white/40 font-mono">{proj.student.email}</div>
                </TableCell>

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

                <TableCell className="py-3 px-4">
                  <StatusBadge status={proj.status} />
                </TableCell>

                <TableCell className="py-3 px-4 text-xs text-white/40">
                  {proj.createdAt
                    ? new Date(proj.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>

                <TableCell className="py-3 px-4 text-right">
                  <Button
                    variant={proj.status === "PENDING" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onOpenReview(proj)}
                    className={
                      proj.status === "PENDING"
                        ? "bg-violet-600 hover:bg-violet-500 text-white text-xs h-7 px-3"
                        : "border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white text-xs h-7 px-3"
                    }
                  >
                    {proj.status === "PENDING" ? "Review" : "Update"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06] text-xs text-white/40">
        <div>
          Showing <span className="font-medium text-white/70">{projects.length}</span> of{" "}
          <span className="font-medium text-white/70">{total}</span> projects
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
    </div>
  );
}
