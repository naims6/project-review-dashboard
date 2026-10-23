"use client";

import { useState, useEffect, useCallback } from "react";
import type { User as AuthUser } from "@/types/auth";
import type { StudentProjectItem } from "@/types/project";
import { getMyProjects } from "@/services/project.service";
import { SubmitProjectModal } from "./SubmitProjectModal";
import { StudentProjectsTable } from "./StudentProjectsTable";
import { Button } from "@/components/ui/button";
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface StudentDashboardViewProps {
  user: AuthUser;
}

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
      <StudentProjectsTable
        projects={projects}
        isLoading={isLoading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onOpenSubmitModal={() => setIsModalOpen(true)}
      />

      {/* Submit project modal */}
      <SubmitProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
