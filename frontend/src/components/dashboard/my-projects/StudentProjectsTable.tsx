"use client";

import type { StudentProjectItem } from "@/types/project";
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
  ExternalLink,
  GitBranch,
  Loader2,
  MessageSquare,
  Plus,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import { formatDate } from "@/lib/formatDate";
import { Button } from "@/components/ui/button";

interface StudentProjectsTableProps {
  projects: StudentProjectItem[];
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onOpenSubmitModal: () => void;
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
    <div className="rounded-xl border border-white/[0.07] bg-[#0d0d14] overflow-hidden">
      {/* Table header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div>
          <p className="text-xs font-semibold text-white/80">Submissions</p>
          {!isLoading && (
            <p className="text-[10px] text-white/35 mt-0.5">
              {total} project{total !== 1 ? "s" : ""} submitted
            </p>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/[0.05] hover:bg-transparent">
            <TableHead className="text-white/35 font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4 w-[30%]">
              Project
            </TableHead>
            <TableHead className="text-white/35 font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4">
              Links
            </TableHead>
            <TableHead className="text-white/35 font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4">
              Status
            </TableHead>
            <TableHead className="text-white/35 font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4">
              Submitted
            </TableHead>
            <TableHead className="text-white/35 font-semibold text-[10px] uppercase tracking-wider py-2.5 px-4">
              Mentor Feedback
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center border-0">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <span className="text-xs text-white/30">Loading projects…</span>
                </div>
              </TableCell>
            </TableRow>
          ) : projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-52 text-center border-0">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <FolderGit2 className="w-5 h-5 text-white/20" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/60">
                      No projects yet
                    </p>
                    <p className="text-xs text-white/30 mt-1">
                      Submit your first project to get started
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={onOpenSubmitModal}
                    className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Submit Project
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            projects.map((proj) => (
              <TableRow
                key={proj.id}
                className="border-b border-white/[0.04] hover:bg-violet-500/[0.03] transition-colors group"
              >
                {/* Project name + description */}
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 group-hover:border-violet-500/20 transition-colors">
                      <FolderGit2 className="w-3 h-3 text-white/30 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/90 leading-tight">
                        {proj.name}
                      </p>
                      <p
                        className="text-[11px] text-white/35 mt-0.5 line-clamp-1 max-w-[160px]"
                        title={proj.description}
                      >
                        {proj.description}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Repo + Live links */}
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Repository"
                        className="flex items-center gap-1 text-[11px] text-white/35 hover:text-white/80 transition-colors"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        title="Live Demo"
                        className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                    {!proj.repoUrl && !proj.liveUrl && (
                      <span className="text-[11px] text-white/20">—</span>
                    )}
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5 px-4">
                  <StatusBadge status={proj.status} />
                </TableCell>

                {/* Date */}
                <TableCell className="py-3.5 px-4 text-[11px] text-white/40 tabular-nums">
                  {formatDate(proj.createdAt)}
                </TableCell>

                {/* Mentor feedback */}
                <TableCell className="py-3.5 px-4">
                  {proj.reviewComment ? (
                    <div className="flex items-start gap-2 max-w-[220px] bg-white/[0.02] rounded-lg px-2.5 py-2 border border-white/[0.04]">
                      <MessageSquare className="w-3 h-3 text-violet-400 shrink-0 mt-0.5" />
                      <span
                        className="text-[11px] text-white/60 line-clamp-2 leading-relaxed"
                        title={proj.reviewComment}
                      >
                        {proj.reviewComment}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-white/20 italic">
                      {proj.status === "PENDING" ? "Awaiting review…" : "No comment"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {!isLoading && projects.length > 0 && (
        <div className="border-t border-white/[0.05]">
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            count={projects.length}
            itemLabel="projects"
            isLoading={isLoading}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
