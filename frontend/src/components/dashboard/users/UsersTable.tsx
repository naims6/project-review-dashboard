"use client";

import type { AdminUserItem } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { Pagination } from "@/components/shared/Pagination";
import { formatDate } from "@/lib/formatDate";

interface UsersTableProps {
  users: AdminUserItem[];
  isLoading: boolean;
  totalUsers: number;
  page: number;
  totalPages: number;
  search: string;
  onPageChange: (newPage: number) => void;
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
              <TableCell
                colSpan={4}
                className="h-32 text-center text-xs text-white/40"
              >
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
                  <RoleBadge role={u.role} className="text-[10px]" />
                </TableCell>

                <TableCell className="py-3 px-4 text-xs text-white/40 text-right">
                  {formatDate(u.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={totalUsers}
        count={users.length}
        itemLabel="users"
        isLoading={isLoading}
        onPageChange={onPageChange}
      />
    </div>
  );
}
