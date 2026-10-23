import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-28 pb-24 overflow-hidden">
        {/* Ambient light */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/[0.12] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <p className="text-[13px] font-medium text-violet-400 mb-5 tracking-wide uppercase">
            Project Submission &amp; Review
          </p>

          <h1 className="text-[52px] sm:text-[68px] font-bold leading-[1.04] tracking-[-0.03em] text-white mb-6">
            Submit. <span className="text-violet-400">Review.</span> Ship.
          </h1>

          <p className="text-[17px] text-white/40 leading-relaxed max-w-xl mx-auto mb-10 font-light">
            Students submit projects. Mentors review them. Simple, fast, and
            built for your batch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[14px] font-semibold rounded-lg transition-colors"
            >
              Submit your project
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 border border-white/[0.1] hover:border-white/[0.2] text-white/60 hover:text-white text-[14px] font-medium rounded-lg transition-all"
            >
              Mentor login
            </Link>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-4xl w-full mx-auto mt-20">
          <div className="rounded-xl border border-white/[0.08] bg-[#111118] overflow-hidden shadow-2xl shadow-black/60">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="ml-4 h-4 rounded bg-white/[0.04] w-48" />
            </div>

            {/* Stat cards */}
            <div className="p-5 grid grid-cols-4 gap-3 border-b border-white/[0.05]">
              {[
                { label: "Total", val: "248", cls: "text-violet-400" },
                { label: "Pending", val: "41", cls: "text-amber-400" },
                { label: "Approved", val: "182", cls: "text-emerald-400" },
                { label: "Rejected", val: "25", cls: "text-red-400" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3.5"
                >
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">
                    {s.label}
                  </p>
                  <p className={`text-[22px] font-bold ${s.cls}`}>
                    {s.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="p-5">
              <div className="grid grid-cols-5 gap-4 text-[10px] text-white/20 uppercase tracking-widest px-2 pb-2">
                <span>Project</span>
                <span>Student</span>
                <span>Date</span>
                <span>Status</span>
                <span>Action</span>
              </div>
              {[
                {
                  name: "E-Commerce App",
                  student: "Rahim K.",
                  date: "Oct 20",
                  status: "pending",
                },
                {
                  name: "Portfolio Site",
                  student: "Ayesha M.",
                  date: "Oct 19",
                  status: "approved",
                },
                {
                  name: "Task Manager",
                  student: "Sumon R.",
                  date: "Oct 18",
                  status: "rejected",
                },
                {
                  name: "Chat App",
                  student: "Nipa A.",
                  date: "Oct 17",
                  status: "approved",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-4 items-center px-2 py-2.5 rounded-md hover:bg-white/[0.02] transition-colors text-xs"
                >
                  <span className="text-white/70 font-medium truncate">
                    {row.name}
                  </span>
                  <span className="text-white/30 truncate">{row.student}</span>
                  <span className="text-white/20">{row.date}</span>
                  <span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                        row.status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : row.status === "rejected"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {row.status}
                    </span>
                  </span>
                  <div className="flex gap-1.5">
                    <div className="h-5 w-12 rounded bg-emerald-500/10 border border-emerald-500/20" />
                    <div className="h-5 w-12 rounded bg-red-500/10 border border-red-500/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Fade out bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none" />
        </div>
      </section>
    </>
  );
}
