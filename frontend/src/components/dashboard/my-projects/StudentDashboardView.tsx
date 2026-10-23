"use client";

import { useState } from "react";
import type { User as AuthUser } from "@/types/auth";
import { useMyProjects } from "@/hooks/queries/use-student-queries";
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

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total",
    icon: FolderGit2,
    iconColor: "text-violet-400",
    valueColor: "text-white",
    border: "border-white/[0.07]",
    bg: "bg-white/[0.02]",
    glow: "",
  },
  {
    key: "pending" as const,
    label: "Pending",
    icon: Clock,
    iconColor: "text-amber-400",
    valueColor: "text-amber-300",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.04]",
    glow: "shadow-[0_0_18px_-4px_rgba(245,158,11,0.15)]",
  },
  {
    key: "approved" as const,
    label: "Approved",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-300",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/[0.04]",
    glow: "shadow-[0_0_18px_-4px_rgba(52,211,153,0.15)]",
  },
  {
    key: "rejected" as const,
    label: "Rejected",
    icon: XCircle,
    iconColor: "text-rose-400",
    valueColor: "text-rose-300",
    border: "border-rose-500/20",
    bg: "bg-rose-500/[0.04]",
    glow: "shadow-[0_0_18px_-4px_rgba(251,113,133,0.15)]",
  },
];

export function StudentDashboardView({ user }: StudentDashboardViewProps) {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useMyProjects({ page, limit: 10 });

  const projects = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const counts = {
    total,
    pending: projects.filter((p) => p.status === "PENDING").length,
    approved: projects.filter((p) => p.status === "APPROVED").length,
    rejected: projects.filter((p) => p.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-1">
            Student Portal
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            My Projects
          </h1>
          <p className="text-xs text-white/40 mt-1">
            Hi {user.name}, submit your projects and track review status here.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5 shrink-0 shadow-lg shadow-violet-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          Submit Project
        </Button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${stat.border} ${stat.bg} ${stat.glow} transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/35">
                  {stat.label}
                </span>
                <div className="w-6 h-6 rounded-md bg-white/[0.04] flex items-center justify-center">
                  <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-3xl font-bold tracking-tight ${stat.valueColor}`}>
                {isLoading ? (
                  <span className="text-white/20 text-lg">—</span>
                ) : (
                  counts[stat.key]
                )}
              </p>
            </div>
          );
        })}
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

      <SubmitProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
