"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitProject } from "@/hooks/queries/use-student-queries";
import {
  submitProjectSchema,
  type SubmitProjectForm,
} from "@/schemas/project.schema";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2 } from "lucide-react";

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SubmitProjectModal({ isOpen, onClose }: SubmitProjectModalProps) {
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
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  const handleClose = () => {
    reset();
    setServerError(null);
    onClose();
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md bg-[#0e0e17] border border-white/[0.08] rounded-2xl shadow-2xl p-0 gap-0 overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
          <DialogTitle className="text-base font-bold text-white tracking-tight">
            Submit Project
          </DialogTitle>
          <p className="text-xs text-white/40 mt-1">
            Your project will be reviewed by a mentor.
          </p>
        </div>

        {/* Body */}
        <form
          id="submit-project-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="px-6 py-5 space-y-5"
        >
          {serverError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {serverError}
            </div>
          )}

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/50">
              Project Name
            </label>
            <Input
              {...register("name")}
              placeholder="My Awesome App"
              className={inputCls}
            />
            {errors.name && (
              <p className="text-xs text-rose-400">{errors.name.message}</p>
            )}
          </div>

          {/* GitHub Repo */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/50">
              GitHub Repository
            </label>
            <Input
              {...register("repoUrl")}
              type="url"
              placeholder="https://github.com/username/repo"
              className={inputCls}
            />
            {errors.repoUrl && (
              <p className="text-xs text-rose-400">{errors.repoUrl.message}</p>
            )}
          </div>

          {/* Live URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/50">
              Live Demo URL
            </label>
            <Input
              {...register("liveUrl")}
              type="url"
              placeholder="https://my-app.vercel.app"
              className={inputCls}
            />
            {errors.liveUrl && (
              <p className="text-xs text-rose-400">{errors.liveUrl.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-white/50">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="What does your project do? What tech did you use?"
              className={`${inputCls} resize-none leading-relaxed`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400">{errors.description.message}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-xs text-white/50 hover:text-white hover:bg-white/[0.06]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="submit-project-form"
            size="sm"
            disabled={isSubmitting}
            className="text-xs bg-violet-600 hover:bg-violet-500 text-white font-semibold gap-1.5 shadow-lg shadow-violet-600/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Project"
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
