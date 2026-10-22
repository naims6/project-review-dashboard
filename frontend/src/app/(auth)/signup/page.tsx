"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signup } from "@/services/auth.service";

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine((v) => v === true, "You must accept the terms to continue"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupForm = z.infer<typeof schema>;

// ── Password strength ─────────────────────────────────────────────────────────

const PASSWORD_CHECKS = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase",     test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number",        test: (p: string) => /\d/.test(p) },
  { label: "Special char",  test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"] as const;
const STRENGTH_COLOR = ["", "#f87171", "#fbbf24", "#a78bfa", "#34d399"] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SignupForm>({
    resolver: zodResolver(schema),
    defaultValues: { terms: false },
  });

  const password = watch("password", "");
  const strength = PASSWORD_CHECKS.filter((c) => c.test(password)).length;

  const onSubmit = async (data: SignupForm) => {
    setServerError(null);
    try {
      await signup({ name: data.name, email: data.email, password: data.password });
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  };

  // ── Success state ─────────────────────────────────────────────────────────────
  if (isSubmitSuccessful) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <span className="text-emerald-400 text-lg font-bold">✓</span>
          </div>
          <h2 className="text-[22px] font-bold text-white mb-2">Account created</h2>
          <p className="text-[14px] text-white/35 mb-7">
            You can now sign in and submit your projects for review.
          </p>
          <Link
            href="/login"
            className="inline-flex px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-semibold rounded-lg transition-colors"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-16"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="mb-8">
          <Link href="/" className="text-[15px] font-semibold text-white">
            Project<span className="text-violet-400">Hub</span>
          </Link>
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-white tracking-tight mb-1">
          Create account
        </h1>
        <p className="text-[14px] text-white/35 mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
            Sign in
          </Link>
        </p>

        {/* Server error banner */}
        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[13px] text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Full name */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Full name
            </label>
            <input
              type="text"
              placeholder="Rahim Khan"
              {...register("name")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
            {errors.name && (
              <p className="mt-1.5 text-[12px] text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
            {errors.email && (
              <p className="mt-1.5 text-[12px] text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
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

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2.5 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-0.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: n <= strength ? STRENGTH_COLOR[strength] : "rgba(255,255,255,0.07)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {PASSWORD_CHECKS.map(({ label, test }) => (
                      <span
                        key={label}
                        className="text-[11px] transition-colors"
                        style={{ color: test(password) ? "#a78bfa" : "rgba(255,255,255,0.2)" }}
                      >
                        {test(password) ? "✓ " : ""}{label}
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-[11px] font-medium ml-2 shrink-0"
                    style={{ color: STRENGTH_COLOR[strength] }}
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
            {errors.confirmPassword && (
              <p className="mt-1.5 text-[12px] text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-0.5 w-4 h-4 rounded border border-white/15 bg-white/5 accent-violet-500 flex-shrink-0"
              />
              <span className="text-[13px] text-white/30 leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Terms</a>
                {" "}and{" "}
                <a href="#" className="text-violet-400 hover:text-violet-300 transition-colors">Privacy Policy</a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-[12px] text-red-400">{errors.terms.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[14px] font-semibold rounded-lg transition-colors mt-1"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
