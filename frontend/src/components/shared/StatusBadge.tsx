import type { ProjectStatus } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  APPROVED: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  REJECTED: "border-rose-500/30 text-rose-400 bg-rose-500/10",
  PENDING: "border-amber-500/30 text-amber-400 bg-amber-500/10",
};

const STATUS_ICONS: Record<ProjectStatus, React.ReactNode> = {
  APPROVED: <CheckCircle2 className="w-3 h-3" />,
  REJECTED: <XCircle className="w-3 h-3" />,
  PENDING: <Clock className="w-3 h-3" />,
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={`text-[10px] gap-1 ${STATUS_STYLES[status]} ${className ?? ""}`}
    >
      {STATUS_ICONS[status]}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  );
}
