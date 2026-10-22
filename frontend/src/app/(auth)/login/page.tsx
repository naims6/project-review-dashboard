"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4"
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
          Welcome back
        </h1>
        <p className="text-[14px] text-white/35 mb-8">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Sign up
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wider">
                Password
              </label>
              <a
                href="#"
                className="text-[12px] text-white/30 hover:text-violet-400 transition-colors"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
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
          </div>

          {/* Remember */}
          <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border border-white/15 bg-white/5 accent-violet-500"
            />
            <span className="text-[13px] text-white/30">Stay signed in</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-[14px] font-semibold rounded-lg transition-colors mt-2"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
