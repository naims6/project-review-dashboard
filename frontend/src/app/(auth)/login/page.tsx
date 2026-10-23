"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import { loginSchema, type LoginForm } from "@/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-white tracking-tight mb-1">
          Welcome back
        </h1>
        <p className="text-[14px] text-white/35 mb-8">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
            Sign up
          </Link>
        </p>

        {/* Server error banner */}
        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[13px] text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <FormField label="Email" error={errors.email?.message} variant="auth">
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </FormField>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider">
                Password
              </label>
              <a href="#" className="text-[12px] text-white/30 hover:text-violet-400 transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/25 hover:text-white/50 transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-[12px] text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <Input
              type="checkbox"
              className="w-4 h-4 rounded border border-white/15 bg-white/5 accent-violet-500"
            />
            <span className="text-[13px] text-white/30">Stay signed in</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[14px] font-semibold rounded-lg transition-colors mt-2"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
