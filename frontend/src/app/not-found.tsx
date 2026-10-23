import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-violet-800/[0.05] rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-indigo-600/[0.05] rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:60px_60px]" />

      <div className="relative flex flex-col items-center text-center max-w-lg">
        {/* 404 large number */}
        <div className="relative mb-6 select-none">
          <span className="text-[140px] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-violet-400/15 to-violet-600/[0.08]">
            404
          </span>
          {/* Glowing underline */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
        </div>

        {/* Icon badge */}
        <div className="mb-6 w-14 h-14 rounded-2xl bg-violet-500/[0.08] border border-violet-500/[0.15] flex items-center justify-center">
          <svg
            className="w-6 h-6 text-violet-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-[28px] sm:text-[34px] font-bold tracking-tight text-white mb-3">
          Page not found
        </h1>
        <p className="text-[15px] text-white/35 leading-relaxed mb-10 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-semibold rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go home
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 border border-white/[0.1] hover:border-white/[0.2] text-white/60 hover:text-white text-[14px] font-medium rounded-lg transition-all"
          >
            Sign in
          </Link>
        </div>

        {/* Subtle breadcrumb hint */}
        <p className="mt-10 text-[12px] text-white/15 tracking-wide">
          Project<span className="text-violet-400/50">Hub</span> · Error 404
        </p>
      </div>
    </div>
  );
}
