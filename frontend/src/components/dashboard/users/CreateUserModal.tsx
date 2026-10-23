"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/hooks/queries/use-admin-queries";
import { createUserSchema, type CreateUserForm } from "@/schemas/user.schema";
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
import {
  UserPlus,
  Loader2,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { FormField } from "@/components/shared/FormField";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateUserModal({
  isOpen,
  onClose,
}: CreateUserModalProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "MENTOR",
    },
  });

  const isSubmitting = createUser.isPending;
  const selectedRole = watch("role");

  const onSubmit = async (data: CreateUserForm) => {
    setServerError(null);

    try {
      await createUser.mutateAsync({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      });
      reset();
      onClose();
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Failed to create user account. Please check the details and try again.",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-[#111118] border border-white/[0.08] text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="gap-1.5 pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 text-violet-400">
            <UserPlus className="w-4 h-4" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Admin Action
            </span>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Create New Account
          </DialogTitle>
          <DialogDescription className="text-xs text-white/50">
            Register a verified student or onboard an authorized mentor.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 flex items-center gap-2 mt-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Role Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2">
              Select Role <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("role", "MENTOR", { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedRole === "MENTOR"
                    ? "bg-violet-600/20 border-violet-500/60 text-violet-300 ring-2 ring-violet-500/20"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                Mentor
              </button>

              <button
                type="button"
                onClick={() => setValue("role", "STUDENT", { shouldValidate: true })}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedRole === "STUDENT"
                    ? "bg-violet-600/20 border-violet-500/60 text-violet-300 ring-2 ring-violet-500/20"
                    : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Student
              </button>
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-rose-400">{errors.role.message}</p>
            )}
          </div>

          {/* Full Name */}
          <FormField label="Full Name *" error={errors.name?.message}>
            <Input
              type="text"
              placeholder="e.g. John Doe"
              {...register("name")}
              className="bg-white/[0.03] border-white/[0.08] text-white text-xs placeholder:text-white/20 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
            />
          </FormField>

          {/* Email */}
          <FormField label="Email Address *" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className="bg-white/[0.03] border-white/[0.08] text-white text-xs placeholder:text-white/20 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20"
            />
          </FormField>

          {/* Password */}
          <FormField label="Password *" error={errors.password?.message}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                {...register("password")}
                className="bg-white/[0.03] border-white/[0.08] text-white text-xs placeholder:text-white/20 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </FormField>

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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
