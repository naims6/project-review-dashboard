"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitProject } from "@/hooks/queries/use-student-queries";
import { submitProjectSchema, type SubmitProjectForm } from "@/schemas/project.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, FolderGit2 } from "lucide-react";

// ── Props ────────────────────────────────────────────────────────────────────

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────────────────
// Reusable field wrapper
const Field = ({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider">
        {label}
      </label>
      {hint && <span className="text-[10px] text-white/30">{hint}</span>}
    </div>
    {children}
    {error && <p className="mt-1 text-[11px] text-rose-400">{error}</p>}
  </div>
);

export function SubmitProjectModal({
  isOpen,
  onClose,
}: SubmitProjectModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const submit = useSubmitProject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmitProjectForm>({ resolver: zodResolver(submitProjectSchema) });

  const isSubmitting = submit.isPending;

  const onSubmit = async (data: SubmitProjectForm) => {
    setServerError(null);
    try {
      await submit.mutateAsync(data);
      reset();
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Failed to submit project. Please try again.",
      );
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs placeholder:text-white/20 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.05] transition-all";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg bg-[#111118] border border-white/[0.08] text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="gap-1.5 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <FolderGit2 className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
              New Submission
            </span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Submit Your Project
          </DialogTitle>
          <DialogDescription className="text-xs text-white/50">
            Fill in the details below. Your project will be reviewed by a
            mentor.
          </DialogDescription>
        </DialogHeader>

        {/* Server error */}
        {serverError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
          {/* Project Name */}
          <Field
            label="Project Name"
            hint="min 2 chars"
            error={errors.name?.message}
          >
            <Input
              {...register("name")}
              placeholder="e.g. E-Commerce App"
              className={inputClass}
            />
          </Field>

          {/* Repo URL */}
          <Field
            label="GitHub Repository URL"
            hint="must be github.com"
            error={errors.repoUrl?.message}
          >
            <Input
              {...register("repoUrl")}
              type="url"
              placeholder="https://github.com/username/repo"
              className={inputClass}
            />
          </Field>

          {/* Live URL */}
          <Field label="Live Demo URL" error={errors.liveUrl?.message}>
            <Input
              {...register("liveUrl")}
              type="url"
              placeholder="https://my-project.vercel.app"
              className={inputClass}
            />
          </Field>

          {/* Description */}
          <Field
            label="Description"
            hint="min 5 chars"
            error={errors.description?.message}
          >
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe what your project does, the tech stack used, and any notable features..."
              className={`${inputClass} resize-none`}
            />
          </Field>

          <DialogFooter className="pt-2 gap-2 border-t border-white/[0.06]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
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
                  Submitting...
                </>
              ) : (
                "Submit Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
