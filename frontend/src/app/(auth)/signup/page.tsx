"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signup } from "@/services/auth.service";
import { signupSchema, type SignupForm } from "@/schemas/auth.schema";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";

// ── Password strength ─────────────────────────────────────────────────────────

const PASSWORD_CHECKS = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special char", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"] as const;

// Tailwind classes for each strength level (index 0 unused)
const STRENGTH_BAR_CLASSES = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-violet-400",
  "bg-emerald-400",
] as const;

const STRENGTH_TEXT_CLASSES = [
  "",
  "text-red-400",
  "text-amber-400",
  "text-violet-400",
  "text-emerald-400",
] as const;

// ── Component ─────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { terms: false },
  });

  const password = watch("password", "");
  const strength = PASSWORD_CHECKS.filter((c) => c.test(password)).length;

  const onSubmit = async (data: SignupForm) => {
    setServerError(null);
    try {
      await signup({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  // ── Form ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="mb-8">
          <Logo />
        </div>

        {/* Heading */}
        <h1 className="text-[26px] font-bold text-white tracking-tight mb-1">
          Create account
        </h1>
        <p className="text-[14px] text-white/35 mb-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Server error banner */}
        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[13px] text-red-400">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Full name */}
          <FormField label="Full name" error={errors.name?.message} variant="auth">
            <Input
              type="text"
              placeholder="Rahim Khan"
              {...register("name")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </FormField>

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
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Password
            </label>
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
              <p className="mt-1.5 text-[12px] text-red-400">
                {errors.password.message}
              </p>
            )}

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="mt-2.5 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                        n <= strength
                          ? STRENGTH_BAR_CLASSES[strength]
                          : "bg-white/[0.07]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {PASSWORD_CHECKS.map(({ label, test }) => (
                      <span
                        key={label}
                        className={`text-[11px] transition-colors ${
                          test(password) ? "text-violet-400" : "text-white/20"
                        }`}
                      >
                        {test(password) ? "✓ " : ""}
                        {label}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-[11px] font-medium ml-2 shrink-0 ${STRENGTH_TEXT_CLASSES[strength]}`}
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <FormField label="Confirm password" error={errors.confirmPassword?.message} variant="auth">
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </FormField>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <Input
                type="checkbox"
                {...register("terms")}
                className="mt-0.5 w-4 h-4 rounded border border-white/15 bg-white/5 accent-violet-500 flex-shrink-0"
              />
              <span className="text-[13px] text-white/30 leading-relaxed">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1.5 text-[12px] text-red-400">
                {errors.terms.message}
              </p>
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
