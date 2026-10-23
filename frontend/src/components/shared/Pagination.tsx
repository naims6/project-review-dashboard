import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  count: number;
  itemLabel?: string;
  isLoading?: boolean;
  onPageChange: (newPage: number) => void;
}

export function Pagination({
  page,
  totalPages,
  total,
  count,
  itemLabel = "items",
  isLoading = false,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06] text-xs text-white/40">
      <div>
        Showing <span className="font-medium text-white/70">{count}</span> of{" "}
        <span className="font-medium text-white/70">{total}</span> {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        <span className="text-xs text-white/50 px-1">
          {page} / {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
          className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
