import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/20">
        <span>© 2024 ProjectHub</span>
        <div className="flex items-center gap-5">
          <Link href="/login" className="hover:text-white/50 transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="hover:text-white/50 transition-colors">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
