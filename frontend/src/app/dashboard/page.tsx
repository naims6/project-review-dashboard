import { getMe } from "@/services/auth.service";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { User, ShieldCheck, Calendar, FolderGit2, CheckCircle2, Clock } from "lucide-react";

async function DashboardContent() {
  let user;

  try {
    user = await getMe();
  } catch {
    redirect("/login");
  }

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <>
      {/* ── Dashboard Navigation Bar ── */}
      <header className="border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-[16px] font-semibold text-white tracking-tight">
            Project<span className="text-violet-400">Hub</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/70 font-medium">{user.name}</span>
              <span className="text-white/30">|</span>
              <span className="text-violet-400 uppercase text-[10px] font-semibold tracking-wider">
                {user.role}
              </span>
            </div>

            <LogoutButton />
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/40 via-violet-900/20 to-transparent border border-violet-500/20 p-8 mb-8">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-widest text-violet-400 font-semibold mb-2">
              Student Workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user.name}!
            </h1>
            <p className="text-sm text-white/50 max-w-xl">
              Manage your project submissions, track mentor feedback, and review assignment progress.
            </p>
          </div>

          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Submitted Projects
              </span>
              <FolderGit2 className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-xs text-white/30 mt-1">Ready to upload your first project</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Under Review
              </span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-400">0</p>
            <p className="text-xs text-white/30 mt-1">Waiting for mentor feedback</p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/40 font-medium uppercase tracking-wider">
                Approved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-emerald-400">0</p>
            <p className="text-xs text-white/30 mt-1">Passed all requirements</p>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="rounded-xl border border-white/[0.08] bg-[#111118] p-6">
          <h2 className="text-base font-semibold text-white mb-4">Your Profile Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <User className="w-4 h-4 text-violet-400 shrink-0" />
              <div>
                <p className="text-xs text-white/30">Full Name</p>
                <p className="font-medium text-white/90">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
              <div>
                <p className="text-xs text-white/30">Email Address</p>
                <p className="font-medium text-white/90">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-white/30">Assigned Role</p>
                <p className="font-medium text-white/90">{user.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
              <div>
                <p className="text-xs text-white/30">Joined Date</p>
                <p className="font-medium text-white/90">{formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] text-white flex flex-col"
      style={{ fontFamily: "var(--font-inter)" }}
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
