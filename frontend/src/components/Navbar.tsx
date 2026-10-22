import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-[15px] font-semibold tracking-tight text-white">
            Project<span className="text-violet-400">Hub</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-[13px] font-medium text-white/50 hover:text-white transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-medium bg-violet-600 hover:bg-violet-500 text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
