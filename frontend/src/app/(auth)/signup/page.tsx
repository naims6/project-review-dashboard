"use client";

import Link from "next/link";
import { useState } from "react";

const checks = [
  { label: "8+ characters", test: (p: string) => p.length >= 8 },
  { label: "Uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Number", test: (p: string) => /\d/.test(p) },
  { label: "Special char", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 1200);
  };

  if (done) {
    return (
      <div
        className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4"
        style={{ fontFamily: "var(--font-inter)" }}
      >
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <span className="text-emerald-400 text-lg font-bold">✓</span>
          </div>
          <h2 className="text-[22px] font-bold text-white mb-2">
            Account created
          </h2>
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

  const strength = checks.filter((c) => c.test(password)).length;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#f87171", "#fbbf24", "#a78bfa", "#34d399"][
    strength
  ];

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
          <Link
            href="/login"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Full name
            </label>
            <input
              type="text"
              placeholder="Rahim Khan"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-white/25 hover:text-white/50 transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2.5 space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="h-0.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background:
                          n <= strength
                            ? strengthColor
                            : "rgba(255,255,255,0.07)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {checks.map(({ label, test }) => (
                      <span
                        key={label}
                        className="text-[11px] transition-colors"
                        style={{
                          color: test(password)
                            ? "#a78bfa"
                            : "rgba(255,255,255,0.2)",
                        }}
                      >
                        {test(password) ? "✓ " : ""}
                        {label}
                      </span>
                    ))}
                  </div>
                  <span
                    className="text-[11px] font-medium ml-2 shrink-0"
                    style={{ color: strengthColor }}
                  >
                    {strengthLabel}
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
              required
              className="w-full px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-[14px] placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              required
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[14px] font-semibold rounded-lg transition-colors mt-1"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
