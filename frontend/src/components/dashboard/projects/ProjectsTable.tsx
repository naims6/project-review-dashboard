"use client";

import type { MentorProjectItem } from "@/types/mentor";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, GitBranch, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Pagination } from "@/components/shared/Pagination";
import { formatDate } from "@/lib/formatDate";

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
              <TableCell
                colSpan={6}
                className="h-32 text-center text-xs text-white/40"
              >
                {search
                  ? `No projects matching "${search}"`
                  : "No projects found"}
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
                  <div className="text-xs text-white/80">
                    {proj.student.name}
                  </div>
                  <div className="text-[11px] text-white/40 font-mono">
                    {proj.student.email}
                  </div>
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
                  {formatDate(proj.createdAt)}
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
  );
}
