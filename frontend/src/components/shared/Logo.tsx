import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`text-[19px] font-bold tracking-tight text-white leading-none ${className}`}
    >
      Project<span className="text-violet-400">Hub</span>
    </Link>
  );
}
