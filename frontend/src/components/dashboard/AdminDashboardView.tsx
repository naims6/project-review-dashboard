"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminUsers } from "@/services/admin.service";
import type { AdminUserItem } from "@/types/admin";
import type { Role } from "@/types/auth";
import { CreateUserModal } from "./CreateUserModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  UserPlus,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

export function AdminDashboardView() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "email" | "role">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminUsers({
        page,
        limit: 10,
        role: roleFilter,
        search: search.trim() || undefined,
        sortBy,
        sortOrder,
      });

      setUsers(res.data || []);
      setTotalUsers(res.meta?.total || 0);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleFilterChange = (role: Role | "ALL") => {
    setRoleFilter(role);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
  };

  const getRoleBadge = (role: Role) => {
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
  };

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
            Users
          </h1>
          <p className="text-xs text-white/50">
            Manage student and mentor accounts.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-violet-600 hover:bg-violet-500 text-white text-xs h-8 gap-1.5"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Add User
        </Button>
      </div>

      {/* ── Filter & Search Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Role Pills */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-x-auto">
          {(["ALL", "STUDENT", "MENTOR", "ADMIN"] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleFilterChange(role)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                roleFilter === role
                  ? "bg-violet-600 text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {role === "ALL" ? "All" : role}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <Input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 bg-white/[0.03] border-white/[0.06] text-white text-xs placeholder:text-white/20 h-8"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setPage(1);
            }}
            className="px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/70 text-xs focus:outline-none h-8 cursor-pointer"
          >
            <option value="createdAt" className="bg-[#111118]">Date</option>
            <option value="name" className="bg-[#111118]">Name</option>
            <option value="email" className="bg-[#111118]">Email</option>
            <option value="role" className="bg-[#111118]">Role</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-8 text-xs shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
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
                    {getRoleBadge(u.role)}
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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setPage((p) => p + 1)}
              className="border-white/[0.08] bg-white/[0.02] text-white/70 hover:text-white h-7 px-2 text-xs"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
