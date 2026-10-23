import type { Role } from "@/types/auth";
import { Badge } from "@/components/ui/badge";

const ROLE_STYLES: Record<Role, string> = {
  ADMIN: "border-violet-500/40 text-violet-300 bg-violet-500/10",
  MENTOR: "border-cyan-500/40 text-cyan-300 bg-cyan-500/10",
  STUDENT: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
};

interface RoleBadgeProps {
  role: Role;
  /** Extra className forwarded to Badge */
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`uppercase font-bold tracking-wider ${ROLE_STYLES[role]} ${className ?? ""}`}
    >
      {role}
    </Badge>
  );
}
