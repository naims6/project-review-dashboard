import Link from "next/link";

export default async function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-32 pb-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-violet-600/[0.10] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Label */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/[0.07] text-[12px] font-medium text-violet-400 mb-6 tracking-wide">
            Project Submission &amp; Review Platform
          </span>

          {/* Headline */}
          <h1 className="text-[48px] sm:text-[62px] font-bold leading-[1.06] tracking-[-0.03em] text-white mb-5">
            Submit your project.{" "}
            <span className="text-violet-400">Get reviewed.</span>
          </h1>

          {/* Sub-copy */}
          <p className="text-[16px] text-white/40 leading-relaxed max-w-lg mx-auto mb-10 font-light">
            Students submit their projects with a repo link and live demo.
            Mentors review, approve, or reject them — with feedback.
          </p>

          {/* CTA */}
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white text-[15px] font-semibold rounded-lg transition-colors"
          >
            Submit your project →
          </Link>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-6 pb-28 max-w-3xl mx-auto">
        <h2 className="text-center text-[13px] font-semibold text-white/25 uppercase tracking-widest mb-10">
          How it works
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              step: "01",
              title: "Create an account",
              desc: "Sign up as a student. No approval needed — you are in immediately.",
            },
            {
              step: "02",
              title: "Submit your project",
              desc: "Add your project name, GitHub repo URL, live demo link, and a short description.",
            },
            {
              step: "03",
              title: "Get reviewed",
              desc: "A mentor reviews your submission and marks it approved or rejected, with optional feedback.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 text-left"
            >
              <span className="text-[11px] font-bold text-violet-400/60 tracking-widest mb-3 block">
                {item.step}
              </span>
              <h3 className="text-[14px] font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-[13px] text-white/35 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── What you submit ── */}
      <section className="px-6 pb-32 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-white/[0.07] bg-[#111118] p-8">
          <h2 className="text-[18px] font-bold text-white mb-1">
            What you submit
          </h2>
          <p className="text-[13px] text-white/35 mb-7">
            Every submission requires four fields — nothing more.
          </p>

          <div className="space-y-4">
            {[
              {
                label: "Project Name",
                example: "E-Commerce App",
                color: "text-violet-400",
              },
              {
                label: "Repo URL",
                example: "https://github.com/you/project",
                color: "text-sky-400",
              },
              {
                label: "Live Link",
                example: "https://my-project.vercel.app",
                color: "text-emerald-400",
              },
              {
                label: "Description",
                example: "A full-stack e-commerce app built with Next.js…",
                color: "text-amber-400",
              },
            ].map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-4 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]"
              >
                <span className="text-[11px] font-semibold text-white/35 w-28 shrink-0 uppercase tracking-wider">
                  {field.label}
                </span>
                <span className={`text-[13px] font-mono ${field.color}`}>
                  {field.example}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-6 border-t border-white/[0.06]">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              Get started — it&apos;s free
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
