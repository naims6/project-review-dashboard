"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { reviewProject } from "@/services/mentor.service";
import type { MentorProjectItem } from "@/types/mentor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  GitBranch,
  Loader2,
  User,
  Mail,
  AlertCircle,
} from "lucide-react";

const reviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"], {
    error: "Please select either APPROVED or REJECTED",
  }),
  reviewComment: z
    .string()
    .max(500, "Review comment cannot exceed 500 characters")
    .optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewProjectModalProps {
  project: MentorProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewProjectModal({
  project,
  isOpen,
  onClose,
  onSuccess,
}: ReviewProjectModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: (project?.status === "APPROVED" || project?.status === "REJECTED")
        ? project.status
        : "APPROVED",
      reviewComment: "",
    },
  });

  const selectedStatus = watch("status");

  const onSubmit = async (data: ReviewFormData) => {
    if (!project) return;
    setServerError(null);

    try {
      await reviewProject(project.id, {
        status: data.status,
        reviewComment: data.reviewComment?.trim() || undefined,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Failed to submit review. Please try again.",
      );
    }
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-[#111118] border border-white/[0.08] text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="gap-1.5 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              Project Review
            </span>
            <Badge
              variant="outline"
              className={
                project.status === "APPROVED"
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : project.status === "REJECTED"
                  ? "border-rose-500/30 text-rose-400 bg-rose-500/10"
                  : "border-amber-500/30 text-amber-400 bg-amber-500/10"
              }
            >
              Current: {project.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            {project.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-white/50">
            Submitted by {project.student.name} • Evaluate code quality and requirements
          </DialogDescription>
        </DialogHeader>

        {/* Project & Student Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs">
          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5">
            <User className="w-4 h-4 text-violet-400 shrink-0" />
            <div className="truncate">
              <span className="text-white/40 block text-[10px]">Student</span>
              <span className="font-medium text-white/90 truncate block">
                {project.student.name}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-violet-400 shrink-0" />
            <div className="truncate">
              <span className="text-white/40 block text-[10px]">Email</span>
              <span className="font-medium text-white/90 truncate block">
                {project.student.email}
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2.5 pb-2">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white/80 hover:text-white transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              Source Repository
              <ExternalLink className="w-3 h-3 text-white/30" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-xs font-medium text-violet-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Live Deployment
            </a>
          )}
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Review Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Status Decision Buttons */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
              Decision <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("status", "APPROVED", { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedStatus === "APPROVED"
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Approve Project
              </button>

              <button
                type="button"
                onClick={() => setValue("status", "REJECTED", { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedStatus === "REJECTED"
                    ? "bg-rose-500/15 border-rose-500/50 text-rose-400 ring-2 ring-rose-500/20 shadow-lg shadow-rose-500/10"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <XCircle className="w-4 h-4 text-rose-400" />
                Reject Project
              </button>
            </div>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-400">{errors.status.message}</p>
            )}
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-1.5">
              Feedback & Comments <span className="text-white/30 lowercase">(optional)</span>
            </label>
            <textarea
              {...register("reviewComment")}
              rows={3}
              placeholder="Provide constructive feedback, notes on architecture, or improvements needed..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.05] transition-all resize-none"
            />
            {errors.reviewComment && (
              <p className="mt-1 text-xs text-rose-400">{errors.reviewComment.message}</p>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-white/[0.1] bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-500 text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save Decision"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
