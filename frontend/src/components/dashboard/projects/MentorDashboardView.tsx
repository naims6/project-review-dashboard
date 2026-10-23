"use client";

import { useState, useEffect, useCallback } from "react";
import { getMentorProjects, getMentorStats } from "@/services/mentor.service";
import type {
  MentorProjectItem,
  MentorStats,
  ProjectStatus,
} from "@/types/mentor";
import { ReviewProjectModal } from "./ReviewProjectModal";
import { ProjectsTable } from "./ProjectsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown } from "lucide-react";

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
      <ProjectsTable
        projects={projects}
        isLoading={isLoading}
        total={total}
        page={page}
        totalPages={totalPages}
        search={search}
        onPageChange={setPage}
        onOpenReview={handleOpenReview}
      />

      <ReviewProjectModal
        project={selectedProject}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
}
