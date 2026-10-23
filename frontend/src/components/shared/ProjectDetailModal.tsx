"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/formatDate";
import { useProjectDetail } from "@/hooks/queries/use-student-queries";
import { useMentorProjectDetail } from "@/hooks/queries/use-mentor-queries";
import {
  GitBranch,
  ExternalLink,
  Calendar,
  Clock,
  MessageSquare,
  User,
  Loader2,
  FolderGit2,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProjectDetailModalProps {
  projectId: string | null;
  role: "STUDENT" | "MENTOR" | "ADMIN";
  onClose: () => void;
}

// ── Small helpers ─────────────────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-0.5">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

// ── Modal content shared between roles ───────────────────────────────────────

function ModalBody({
  projectId,
  role,
}: {
  projectId: string;
  role: "STUDENT" | "MENTOR" | "ADMIN";
}) {
  // Student uses /projects/:id  — Mentor/Admin use /mentor/projects/:id
  const isStudent = role === "STUDENT";

  const studentQuery = useProjectDetail(isStudent ? projectId : null);
  const mentorQuery = useMentorProjectDetail(!isStudent ? projectId : null);

  const query = isStudent ? studentQuery : mentorQuery;
  const project = query.data;

  // ── Loading ──
  if (query.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
        <p className="text-xs text-white/30">Loading project details…</p>
      </div>
    );
  }

  // ── Error ──
  if (query.isError || !project) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16">
        <p className="text-sm text-white/50">Failed to load project details.</p>
        <p className="text-xs text-white/25">Please close and try again.</p>
      </div>
    );
  }

  // ── Mentor-only fields (student info, reviewer) ──
  const mentorProject = !isStudent ? (project as import("@/types/mentor").MentorProjectDetail) : null;

  return (
    <div className="px-6 py-5 space-y-6">
      {/* ── Status + name ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-1">
            Project
          </p>
          <h2 className="text-lg font-bold text-white tracking-tight truncate">
            {project.name}
          </h2>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* ── Description ── */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
          Description
        </p>
        <p className="text-sm text-white/70 leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* ── Detail rows ── */}
      <div className="space-y-4">
        {/* Links */}
        <DetailRow
          icon={<GitBranch className="w-3.5 h-3.5 text-white/40" />}
          label="GitHub Repository"
        >
          {project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 truncate"
            >
              {project.repoUrl}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <span className="text-sm text-white/25 italic">Not provided</span>
          )}
        </DetailRow>

        <DetailRow
          icon={<ExternalLink className="w-3.5 h-3.5 text-white/40" />}
          label="Live Demo"
        >
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5 truncate"
            >
              {project.liveUrl}
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          ) : (
            <span className="text-sm text-white/25 italic">Not provided</span>
          )}
        </DetailRow>

        {/* Student info — mentor/admin only */}
        {mentorProject?.student && (
          <DetailRow
            icon={<User className="w-3.5 h-3.5 text-white/40" />}
            label="Submitted By"
          >
            <p className="text-sm font-medium text-white/85">
              {mentorProject.student.name}
            </p>
            <p className="text-xs text-white/35 font-mono mt-0.5">
              {mentorProject.student.email}
            </p>
          </DetailRow>
        )}

        {/* Dates */}
        <DetailRow
          icon={<Calendar className="w-3.5 h-3.5 text-white/40" />}
          label="Submitted"
        >
          <p className="text-sm text-white/70">{formatDate(project.createdAt)}</p>
        </DetailRow>

        {project.reviewedAt && (
          <DetailRow
            icon={<Clock className="w-3.5 h-3.5 text-white/40" />}
            label="Reviewed"
          >
            <p className="text-sm text-white/70">{formatDate(project.reviewedAt)}</p>
          </DetailRow>
        )}

        {/* Reviewer — mentor/admin only */}
        {mentorProject?.reviewedBy && (
          <DetailRow
            icon={<UserCheck className="w-3.5 h-3.5 text-white/40" />}
            label="Reviewed By"
          >
            <p className="text-sm font-medium text-white/85">
              {mentorProject.reviewedBy.name}
            </p>
            <p className="text-xs text-white/35 font-mono mt-0.5">
              {mentorProject.reviewedBy.email}
            </p>
          </DetailRow>
        )}
      </div>

      {/* ── Feedback block ── */}
      {project.status !== "PENDING" && (
        <div
          className={`p-4 rounded-xl border ${
            project.status === "APPROVED"
              ? "bg-emerald-500/[0.05] border-emerald-500/20"
              : "bg-rose-500/[0.05] border-rose-500/20"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {project.status === "APPROVED" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            )}
            <p
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                project.status === "APPROVED" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              Mentor Feedback
            </p>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            {project.reviewComment ?? "No comment left by the mentor."}
          </p>
        </div>
      )}

      {/* Pending state */}
      {project.status === "PENDING" && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-amber-500/[0.05] border border-amber-500/15">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-300">
              Awaiting Review
            </p>
            <p className="text-[11px] text-white/35 mt-0.5">
              A mentor will review your project soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

export function ProjectDetailModal({
  projectId,
  role,
  onClose,
}: ProjectDetailModalProps) {
  return (
    <Dialog open={!!projectId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-[#0e0e17] border border-white/[0.08] rounded-2xl shadow-2xl p-0 gap-0 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 border border-violet-500/25 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-white tracking-tight">
                Project Details
              </DialogTitle>
              <p className="text-[11px] text-white/35 mt-0.5">
                {role === "STUDENT"
                  ? "Your submission overview"
                  : "Full submission details"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {projectId && <ModalBody projectId={projectId} role={role} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
