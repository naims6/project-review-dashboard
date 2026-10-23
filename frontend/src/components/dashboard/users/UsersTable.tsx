"use client";

import type { AdminUserItem } from "@/types/admin";
import type { Role } from "@/types/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface UsersTableProps {
  users: AdminUserItem[];
  isLoading: boolean;
  totalUsers: number;
  page: number;
  totalPages: number;
  search: string;
  onPageChange: (newPage: number) => void;
}

function RoleBadge({ role }: { role: Role }) {
  switch (role) {
    case "ADMIN":
      return (
        <Badge
          variant="outline"
          className="border-violet-500/30 text-violet-300 bg-violet-500/10 text-[10px]"
        >
          ADMIN
        </Badge>
      );
    case "MENTOR":
      return (
        <Badge
          variant="outline"
          className="border-cyan-500/30 text-cyan-300 bg-cyan-500/10 text-[10px]"
        >
          MENTOR
        </Badge>
      );
    case "STUDENT":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-300 bg-emerald-500/10 text-[10px]"
        >
          STUDENT
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
}

export function UsersTable({
  users,
  isLoading,
  totalUsers,
  page,
  totalPages,
  search,
  onPageChange,
}: UsersTableProps) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#111118]/80 overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.02] border-b border-white/[0.06]">
          <TableRow className="border-b border-white/[0.06] hover:bg-transparent">
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Name
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Email
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4">
              Role
            </TableHead>
            <TableHead className="text-white/40 font-medium text-xs py-3 px-4 text-right">
              Created
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-36 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-white/40">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <span className="text-xs">Loading users...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-32 text-center text-xs text-white/40">
                {search ? `No users matching "${search}"` : "No users found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow
                key={u.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                <TableCell className="py-3 px-4 text-xs font-medium text-white/90">
                  {u.name}
                </TableCell>

                <TableCell className="py-3 px-4 text-xs font-mono text-white/60">
                  {u.email}
                </TableCell>

                <TableCell className="py-3 px-4">
                  <RoleBadge role={u.role} />
                </TableCell>

                <TableCell className="py-3 px-4 text-xs text-white/40 text-right">
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/[0.06] text-xs text-white/40">
        <div>
          Showing <span className="font-medium text-white/70">{users.length}</span> of{" "}
          <span className="font-medium text-white/70">{totalUsers}</span> users
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
    </div>
  );
}
