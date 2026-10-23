"use client";

import { useState } from "react";
import { useAdminUsers } from "@/hooks/queries/use-admin-queries";
import type { AdminUserItem } from "@/types/admin";
import type { Role } from "@/types/auth";
import { CreateUserModal } from "./CreateUserModal";
import { UsersTable } from "./UsersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, ArrowUpDown } from "lucide-react";

export function AdminDashboardView() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "email" | "role">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useAdminUsers({
    page,
    limit: 10,
    role: roleFilter,
    search: search.trim() || undefined,
    sortBy,
    sortOrder,
  });

  const users: AdminUserItem[] = data?.data ?? [];
  const totalUsers = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleRoleFilterChange = (role: Role | "ALL") => {
    setRoleFilter(role);
    setPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    setPage(1);
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
              setSortBy(e.target.value as "createdAt" | "name" | "email" | "role");
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
      <UsersTable
        users={users}
        isLoading={isLoading}
        totalUsers={totalUsers}
        page={page}
        totalPages={totalPages}
        search={search}
        onPageChange={setPage}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
