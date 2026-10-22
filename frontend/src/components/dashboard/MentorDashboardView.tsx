"use client";

import { useState, useEffect, useCallback } from "react";
import { getMentorProjects, getMentorStats } from "@/services/mentor.service";
import type {
  MentorProjectItem,
  MentorStats,
  ProjectStatus,
} from "@/types/mentor";
import { ReviewProjectModal } from "./ReviewProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  ExternalLink,
  GitBranch,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface MentorDashboardViewProps {
  initialStats?: MentorStats;
}

export function MentorDashboardView({ initialStats }: MentorDashboardViewProps) {
  const [stats, setStats] = useState<MentorStats>(
    initialStats || { total: 0, pending: 0, approved: 0, rejected: 0 },
  );
  const [projects, setProjects] = useState<MentorProjectItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState<MentorProjectItem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, projectsRes] = await Promise.all([
        getMentorStats(),
        getMentorProjects({
          page,
          limit: 10,
          status: statusFilter,
          search: search.trim() || undefined,
          sortOrder,
        }),
      ]);

      setStats(statsRes);
      setProjects(projectsRes.data || []);
      setTotal(projectsRes.meta?.total || 0);
      setTotalPages(projectsRes.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, search, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenReview = (project: MentorProjectItem) => {
    setSelectedProject(project);
    setIsReviewOpen(true);
  };

  const handleStatusFilterChange = (status: ProjectStatus | "ALL") => {
    setStatusFilter(status);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const getStatusBadge = (status: ProjectStatus) => {
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
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
            Projects
          </h1>
          <p className="text-xs text-white/50">
            Review student project submissions.
          </p>
        </div>
      </div>

      {/* ── Toolbar: Filters, Search, Sort ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? "bg-violet-600 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {status === "ALL" ? "All" : status}
              <span className="ml-1.5 opacity-60 text-[10px]">
                {status === "ALL"
                  ? stats.total
                  : status === "PENDING"
                  ? stats.pending
                  : status === "APPROVED"
                  ? stats.approved
                  : stats.rejected}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 bg-white/[0.03] border-white/[0.06] text-white text-xs placeholder:text-white/20 h-8"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-8 text-xs shrink-0"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
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
                    {getStatusBadge(proj.status)}
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
                      onClick={() => handleOpenReview(proj)}
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
      </div>

      <ReviewProjectModal
        project={selectedProject}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
